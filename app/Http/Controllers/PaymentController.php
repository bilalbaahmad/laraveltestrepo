<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;


/** All Paypal Details class **/
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;
use PayPal\Api\Refund;
use PayPal\Api\Sale;

use Redirect;
use Session;
use URL;
use DB;


class PaymentController extends Controller
{
    private $_api_context;
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function __construct()
    {
        /** PayPal api context **/
        $paypal_conf = \Config::get('paypal');
        $this->_api_context = new ApiContext( new OAuthTokenCredential( $paypal_conf['client_id'], $paypal_conf['secret']));
        $this->_api_context->setConfig( $paypal_conf['settings']);
    }

    public function payWithpaypal(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Upload File'))
        {
            $total_amount = $request->amount;

            $payer = new Payer();
            $payer->setPaymentMethod('paypal');

            $item_1 = new Item();
            $item_1->setName('test user') /** item name **/
                ->setCurrency('USD')
                ->setQuantity(1)
                ->setPrice($total_amount); /** unit price **/

            $item_list = new ItemList();
            $item_list->setItems(array($item_1));

            $amount = new Amount();
            $amount->setCurrency('USD')
                ->setTotal($total_amount);

            $transaction = new Transaction();
            $transaction->setAmount($amount)
                ->setItemList($item_list)
                ->setDescription('Your Transaction Description');

            $redirect_urls = new RedirectUrls();
            $redirect_urls->setReturnUrl(URL::to('api/paymentstatus')) /** Specify return URL **/
                ->setCancelUrl(URL::to('paymentstatus'));

            $payment = new Payment();
            $payment->setIntent('Sale')
                ->setPayer($payer)
                ->setRedirectUrls($redirect_urls)
                ->setTransactions(array($transaction));

            /** dd($payment->create($this->_api_context));exit; **/
            try
            {
                $payment->create($this->_api_context);
            }
            catch (\PayPal\Exception\PPConnectionException $ex)
            {
                if (\Config::get('app.debug'))
                {
                    Session::put('error', 'Connection Timeout');
                    return Redirect::to('/payment');
                }
                else
                {
                    Session::put('error', 'Some error occur, sorry for inconvenient');
                    return Redirect::to('/payment');
                }
            }

            foreach ($payment->getLinks() as $link)
            {
                if ($link->getRel() == 'approval_url')
                {
                    $redirect_url = $link->getHref();
                    break;
                }
            }

            /** add payment ID to session **/
            Session::put('paypal_payment_id', $payment->getId());
            if (isset($redirect_url))
            {
                /** redirect to paypal **/
                return Redirect::away($redirect_url);
            }

            Session::put('error', 'Unknown error occurred');
            return Redirect::to('/payment');
        }
        else
        {
            return "Access Denied";
        }
    }

    public function getPaymentStatus()
    {
        /** Get the payment ID before session clear **/
        $payment_id = Session::get('paypal_payment_id');

        /** clear the session payment ID **/
        Session::forget('paypal_payment_id');
        if (empty(Input::get('PayerID')) || empty(Input::get('token')))
        {
            Session::put('error', 'Payment failed');
            return Redirect::to('/payment');
        }

        $payment = Payment::get($payment_id, $this->_api_context);

        $execution = new PaymentExecution();
        $execution->setPayerId(Input::get('PayerID'));

        /**Execute the payment **/
        $result = $payment->execute($execution, $this->_api_context);

        //get sale id
        $transactions = $payment->getTransactions();
        $relatedResources = $transactions[0]->getRelatedResources();
        $sale = $relatedResources[0]->getSale();
        $saleId = $sale->getId();

        if ($result->getState() == 'approved')
        {
            Session::put('success', 'Payment success');
            Session::put('payment_check', '1');
            Session::put('sales_id', $saleId);

            return Redirect::to('/payment');
        }

        Session::put('error', 'Payment failed');
        return Redirect::to('/payment');
    }

    function CheckPaymentStatus(Request $request)
    {
        $payment = '';

        try
        {
            $payment = Payment::get($request->paymentId, $this->_api_context);
        }
        catch (\PayPal\Exception\PayPalConnectionException $ex)
        {
            $message = $ex->getMessage();
            return $message;
        }

        return $payment;
    }

    function RefundPayment(Request $request)
    {
        /*$refund_amount = $this->input->post('refund_amount');*/
        $refund_amount = 50;
        $paymentId = $request->refundPaymentId;

        $paymentValue =  (string) round($refund_amount,2); ;

        try
        {
            $payment = Payment::get($paymentId, $this->_api_context);
            $transactions = $payment->getTransactions();
            $resources = $transactions[0]->getRelatedResources();//This DOESN'T work for PayPal transactions.

            $sale = $resources[0]->getSale();
            $saleID = $sale->getId();
        }
        catch (\PayPal\Exception\PayPalConnectionException $ex)
        {
            $message = $ex->getMessage();
            return $message;
        }

        // ### Refund amount
        // Includes both the refunded amount (to Payer)
        // and refunded fee (to Payee). Use the $amt->details
        // field to mention fees refund details.
        $amt = new Amount();
        $amt->setCurrency('USD')
            ->setTotal($paymentValue);

        // ### Refund object
        $refundRequest = new Refund();
        $refundRequest->setAmount($amt);

        // ###Sale
        // A sale transaction.
        // Create a Sale object with the
        // given sale transaction id.
        $sale = new Sale();
        $sale->setId($saleID);

        try
        {
            // Refund the sale
            // (See bootstrap.php for more on `ApiContext`)
            $refundedSale = $sale->refundSale($refundRequest, $this->_api_context);
        }
        catch (\PayPal\Exception\PayPalConnectionException $ex)
        {
            $message = $ex->getData();
            return 'in refund ex';
        }

        return $refundedSale;
    }
}
