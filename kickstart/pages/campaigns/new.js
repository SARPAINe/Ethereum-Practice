import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
// import "semantic-ui-css/semantic.min.css";

export class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };
  onChangeHandler = (event) => {
    this.setState({
      minimumContribution: event.target.value,
    });
    // console.log(this.state.minimumContribution);
  };
  onSubmit = async (event) => {
    event.preventDefault(); // prevents the browser from submitting the form
    // alert(this.state.minimumContribution);

    this.setState({
      loading: true,
      errorMessage: "",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({
        errorMessage: err.message,
      });
    }
    this.setState({
      loading: false,
    });
  };
  render() {
    return (
      <div>
        <Layout>
          <h3>Create a Campaign</h3>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Minimum Contribution</label>
              <Input
                label="wei"
                labelPosition="right"
                value={this.state.minimumContribution}
                onChange={this.onChangeHandler}
              ></Input>
            </Form.Field>
            <Message
              error
              header="Oops!"
              content={this.state.errorMessage}
            ></Message>
            <Button primary loading={this.state.loading}>
              Create!
            </Button>
          </Form>
        </Layout>
      </div>
    );
  }
}

export default CampaignNew;
