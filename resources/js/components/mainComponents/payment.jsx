import React, { Component } from "react";
import Input from "../sharedComponents/input";
import PaypalButton from "../sharedComponents/paypalbutton";

const CLIENT = {
    sandbox: 'AYtBAC5c7kEI1ZGMzhDrE_B4KFKoiEvW6yDOGAsbpqyoVmS1VV1USTQ6el9ICcNA2jd9yVnc9qkhFgHW',
    production: 'AYtBAC5c7kEI1ZGMzhDrE_B4KFKoiEvW6yDOGAsbpqyoVmS1VV1USTQ6el9ICcNA2jd9yVnc9qkhFgHW',
};

const ENV = 'production';

export default class Payment extends Component
{

    state = {
        amount:'',
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

    render()
    {
        const state = this.state;

        const onSuccess = (payment) => {
            console.log("Your payment was succeeded!", payment);
        }
        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('You have cancelled the payment!', data);
        }
        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);
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
                            <input type="hidden" name="hosted_button_id" value="BTM8AG3MHH9TS" />
                            <input type="image" src="https://www.sandbox.paypal.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                            <img alt="" border="0" src="https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}