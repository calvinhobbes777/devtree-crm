import React, { Component } from "react";
import api from "../api";
import {
  Button,
  Modal,
  Table,
  Header,
  Rating,
  Icon,
  Dropdown,
  Confirm,
  Segment
} from "semantic-ui-react";
import renderHTML from "react-render-html";

class Prospects extends Component {
  constructor() {
    super();

    this.state = {
      open: false,
      prospects: [],
      error: false
    };
  }

  componentDidMount() {
    api.customers.getAll().then(customers => {
      if (!customers.length && customers.length !== 0) {
        console.log("Return value was not an Array of Customers", customers);
        customers = [];

        this.setState(state => {
          return {
            error: "Unable to fetch customers"
          };
        });
      }
      this.setState(state => {
        return {
          prospects: customers.filter(c => c.type === "prospect")
        };
      });
    });
  }

  removeProspect = id => {
    api.customers.remove(id).then(() => {
      api.customers.getAll().then(customers => {
        if (!customers.length && customers.length !== 0) {
          console.log("Return value was not an Array of Customers", customers);
          customers = [];

          this.setState(state => {
            return {
              error: "Unable to fetch customers"
            };
          });
        }
        this.setState(state => {
          return {
            open: false,
            prospects: customers.filter(c => c.type === "prospect")
          };
        });
      });
    });
  };

  updateProspect = id => {
    this.props.history.push(`/editCustomer/${id}`);
  };

  show = () => this.setState({ open: true });
  hide = () => this.setState({ open: false });

  onSelectChange = (selectEvent, { value }) => {
    let { prospects } = this.state;
    console.log(value);

    let filteredProspects = prospects.filter(
      prospect => prospect.list === value
    );
    console.log(filteredProspects);
    this.setState(state => {});
  };

  render() {
    let { prospects, error } = this.state;

    return (
      <div
        style={{
          padding: 20
        }}
      >
        <Button onClick={() => this.props.history.push(`/`)} animated>
          <Button.Content visible>{"Dashboard"}</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow left" />
          </Button.Content>
        </Button>
        <br />
        <br />
        <br />

        <Segment
          color={"teal"}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <h1>Prospects</h1>

          <div>
            <Dropdown
              button
              selection
              placeholder="Select Prospect Type"
              options={[
                { key: "Business", value: "business", text: "business" },
                { key: "Student", value: "student", text: "student" },
                { key: "All", value: "all", text: "All" }
              ]}
              onChange={this.onSelectChange}
            />
          </div>

          <div>
            <Button onClick={() => this.props.history.push(`/create/prospect`)}>
              Add Prospect
            </Button>
          </div>
        </Segment>

        <br />
        {error && <div>{error}</div>}
        <Table color={"teal"} columns={7} celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <b>
                  <u>NAME</u>
                </b>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <b>
                  <u>COMPANY</u>
                </b>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <b>
                  <u>EMAIL</u>
                </b>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <b>
                  <u>PHONE</u>
                </b>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <b>
                  <u>SITE</u>
                </b>
              </Table.HeaderCell>
              <Table.HeaderCell textAlign={"center"}>
                <b>
                  <u>Narrative</u>
                </b>
              </Table.HeaderCell>
              <Table.HeaderCell textAlign={"center"}>
                <b>
                  <u>EDIT / DELETE</u>
                </b>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {prospects.map(c => (
            <Table.Row key={c.id}>
              <Table.Cell collapsing>
                <p>{c.name}</p>
              </Table.Cell>
              <Table.Cell>
                <p>{c.company}</p>
              </Table.Cell>
              <Table.Cell>
                <p>{c.email}</p>
              </Table.Cell>
              <Table.Cell>
                <p>{c.phone}</p>
              </Table.Cell>
              <Table.Cell>
                <p>{c.site}</p>
              </Table.Cell>
              <Table.Cell style={{ padding: 20 }} textAlign={"center"}>
                <Modal
                  trigger={
                    <Button>
                      <Icon name="browser" />
                    </Button>
                  }
                  basic
                  size="small"
                >
                  <Header>{c.name} - Narrative</Header>
                  <Modal.Content>
                    <p>{renderHTML(c.info)}</p>
                  </Modal.Content>
                </Modal>
              </Table.Cell>
              <Table.Cell style={{ padding: 20 }} textAlign={"center"}>
                <Button onClick={() => this.updateProspect(c.id)}>
                  <Icon name="edit" />
                </Button>
                <Button onClick={() => this.removeProspect(c.id)}>
                  <Icon name="trash outline" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>
    );
  }
}

export default Prospects;
