import React, { Component } from "react";
import Input from "../sharedComponents/input";
import PaypalButton from "../sharedComponents/paypalbutton";

const CLIENT = {
    sandbox: 'AU_zwnHQy564rY6YUqsIdl0UsE9FIGmhRe0R9uMTewEfoOriiLXuksmzoW1iHR1ufy44A2DSMF3Qi9aT',
    production: 'AQaqdgVTLFMaqvVEN6kAL6NtwN5XKkD1MKC_o7mb1Fw16oO0jZdTNShA6ZDQy3vCgFgBCvO0YuetSz-1',
};

const ENV = 'sandbox';

export default class Payment extends Component
{
    constructor()
    {
        super();

        this.resetAmount = this.resetAmount.bind(this);
        this.verifyPayment = this.verifyPayment.bind(this);
        this.refundPayment = this.refundPayment.bind(this);
    }

    state = {
        amount:'',
        paymentId:'',
        refundPaymentId:'',
    };

    handleChange = ({ currentTarget: input }) => {

        let inp_name = input.name;
        let value = input.value;

        if( value <= 0 )
        {
            swal("Warning!", "Amount must be gearter than 0", "warning");
            input.value = '';
            return;
        }

        this.setState({[inp_name]:value});
    };

    handleSubmit = e => {

        e.preventDefault();

        let state = { ...this.state };

        if(state.amount == '')
        {
            swal("Warning!", "Amount is required", "warning");
            return false;
        }
        else if(state.amount < 0 || state.amount == 0)
        {
            swal("Warning!", "Amount must be gearter than 0", "warning");
            return false;
        }

        var header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        const FD = new FormData();
        FD.append('amount', this.state.amount);

        axios({
            method: 'post',
            url: '/api/paywithpaypal',
            headers: header,
            data:FD,

        }).then(response => {
            toast.success('Registered successfully !', {  autoClose: 3000 });
            window.location = '/login';

        }).catch(function (error) {
            toast.error('Something went wrong, please check console log !', {  autoClose: 3000 });
            console.log(error.response);
        });
    };

    resetAmount()
    {
        this.setState({amount:''});
        console.log('in reset');
    }

    verifyPayment()
    {
        console.log('in verify payment function');

        var header = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        };

        const FD = new FormData();
        FD.append('paymentId', this.state.paymentId);

        axios({
            method: 'post',
            url: '/api/checkpaymentstatus/',
            headers: header,
            data:FD,

        }).then(response => {
            const resp = response.data;
            console.log(resp);
        });
    }

    refundPayment()
    {
        console.log('in refund payment function');

        var header = {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        };

        const FD = new FormData();
        FD.append('refundPaymentId', this.state.refundPaymentId);

        axios({
            method: 'post',
            url: '/api/refundpayment/',
            headers: header,
            data:FD,

        }).then(response => {
            const resp = response.data;
            console.log(resp);
        });
    }

    render()
    {
        const state = this.state;

        const onSuccess = (payment) =>
        {
            this.resetAmount();
            console.log("Your payment was succeeded!", payment);
            swal("Success!", "Payment Successful!!, Payment Id: "+payment.paymentID, "success");
        }

        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            this.resetAmount();
            console.log('You have cancelled the payment!', data);
            swal("Canceled!", "Payment Canceled!!", "warning");
        }

        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            this.resetAmount();
            console.log("Error!", err);
            swal("Error!", "Error, Please Check Console Log For Details!!", "error");
            // Since the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }

        let currency = 'USD'; // or you can set this value from your props or state
        let total = state.amount; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout

        return (

            <div className="card">
                <div className="card-head">
                    <div className="card-header">
                        <h4 className="card-title">Payment</h4>
                    </div>
                </div>

                <div className="card-content collapse show">
                    <div className="card-body card-dashboard">
                        <form onSubmit={this.handleSubmit}>
                            <Input
                                name="amount"
                                type="text"
                                label="Total Amount"
                                onChange={this.handleChange}
                                value={this.state.amount}
                            />
                            {/*<button className="btn btn-primary"> Submit </button>*/}
                        </form>

                        <PaypalButton
                            client={CLIENT}
                            env={ENV}
                            commit={true}
                            currency={'USD'}
                            total={total}
                            onSuccess={onSuccess}
                            onError={onError}
                            onCancel={onCancel}
                        />

                        <form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input type="hidden" name="hosted_button_id" value="WUEWKP7HPCXMN" />
                            <input type="image" src="https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                            <img alt="" border="0" src="https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                        </form>

                        <hr />

                        <Input
                            name="paymentId"
                            type="text"
                            label="Get Payment Status"
                            onChange={this.handleChange}
                            value={this.state.paymentId}
                        />

                        <input className='btn btn-success' type='button' onClick={this.verifyPayment} value='Verify'/>

                        <hr />

                        <Input
                            name="refundPaymentId"
                            type="text"
                            label="Refund Payment"
                            onChange={this.handleChange}
                            value={this.state.refundPaymentId}
                        />

                        <input className='btn btn-success' type='button' onClick={this.refundPayment} value='Refund'/>
                    </div>
                </div>
            </div>
        );
    }
}