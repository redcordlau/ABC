import React, { Component } from "react";
import Swal from "sweetalert2";

import DrawerAppBar from "./Header";
import OrderTable from "./OrderTable";

import AddItemForm from "./AddItemForm";

import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class Dashboard extends Component {
  state = {
    members: [],
    event: "",
    restaurantMenu: "",
    isLoaded: false,
    orders: [],
    itemModelOpen: false,
    editOrder: null,
    title: "",
  };

  componentDidMount() {
    let { eventId } = this.props.params;
    let { isEng } = this.props.params;
    isEng = isEng ? isEng : false;
    const engTitleSuffix = isEng ? " - English Menu" : "";
    // Init member
    fetch(`http://${process.env.REACT_APP_SERVER_HOST}/member/all`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        const members = data.map((obj) => ({
          value: obj.uid,
          label: obj.name,
        }));
        this.setState({ members: members });
      });

    fetch(`http://${process.env.REACT_APP_SERVER_HOST}/event?id=${eventId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ event: data });
        document.title = data.descp + " - " + data.organizer + engTitleSuffix;
      });

    fetch(
      `http://${process.env.REACT_APP_SERVER_HOST}/restaurant/menu?eventId=${eventId}&isEng=${isEng}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ restaurantMenu: data, isLoaded: true });
      });

    this.fetchOrder(eventId);
  }

  fetchOrder(eventId) {
    fetch(
      `http://${process.env.REACT_APP_SERVER_HOST}/order?eventId=${eventId}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ orders: data });
      });
  }

  handleEdit = (row) => {
    this.setState({ itemModelOpen: true, editOrder: row });
  };

  showItemModel = (isShow) => {
    this.setState({ itemModelOpen: isShow });
    if (!isShow) {
      this.setState({ editOrder: null });
    }
  };

  addOrderHandler = (props) => {
    let { eventId } = this.props.params;
    var selectedOptions = props.item.name.concat(" ");
    props.modifyGroups.forEach((group) => {
      group.modifierOptions.forEach((option) => {
        if (
          props.modifyGroupSelectedMap &&
          option.id === props.modifyGroupSelectedMap.get(group.id)[0]
        ) {
          selectedOptions = selectedOptions.concat(option.name).concat("-");
        }
      });
    });
    selectedOptions = selectedOptions.substring(0, selectedOptions.length - 1);
    fetch(`http://${process.env.REACT_APP_SERVER_HOST}/order/save`, {
      method: "POST",
      body: JSON.stringify({
        id: props.editOrderId,
        user: props.name,
        orderDisplay: selectedOptions,
        remark: props.remark,
        eventId: eventId,
        itemId: props.item.id,
        categoryId: props.category,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          this.fetchOrder(eventId);
        } else if (response.status === 400) {
          return response.text().then((text) => {
            throw new Error(JSON.parse(text).message);
          });
        } else {
          throw new Error("Got Error, contact Admin");
        }
      })
      .catch((error) => {
        window.alert(error);
      });

    this.setState({ editOrder: null });
  };

  handleDelete = (props) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.value) {
        let { eventId } = this.props.params;
        fetch(`http://${process.env.REACT_APP_SERVER_HOST}/order/delete`, {
          method: "POST",
          body: JSON.stringify({
            id: props.id,
            user: props.user,
            orderDisplay: props.orderDisplay,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => {
            if (response.ok) {
              this.fetchOrder(eventId);
            } else if (response.status === 400) {
              return response.text().then((text) => {
                throw new Error(JSON.parse(text).message);
              });
            } else {
              throw new Error("Got Error, contact Admin");
            }
          })
          .catch((error) => {
            window.alert(error);
          });

        this.setState({ editOrder: null });
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "s data has been deleted.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  render() {
    const { isLoaded } = this.state;
    return (
      <>
        {!isLoaded && <p>loading...</p>}
        {isLoaded && (
          <div className="container">
            <DrawerAppBar
              organizer={this.state.event.organizer}
              descp={this.state.event.descp}
              date={this.state.event.date}
              restaurant={this.state.event.restaurantName}
              menuUrl={this.state.event.menuImgUrl}
            />
            <Box sx={{ m: 4 }}>
              {/* {!this.state.event.isClosed && (
                <EditableOrderTable rows={this.state.orders} handleEdit={this.handleEdit} handleDelete={this.handleDelete} />
              )} */}
              {/* {!this.state.event.isClosed && <OrderTable rows={this.state.orders} handleEdit={this.handleEdit} handleDelete={this.handleDelete} />} */}
              <OrderTable
                rows={this.state.orders}
                handleEdit={this.handleEdit}
                handleDelete={this.handleDelete}
              />
              <AddItemForm
                categories={this.state.restaurantMenu.categories}
                items={this.state.restaurantMenu.items}
                editOrder={this.state.editOrder}
                modifierGroups={this.state.restaurantMenu.modifierGroups}
                members={this.state.members}
                onAddOrder={this.addOrderHandler}
                open={this.state.itemModelOpen}
                showItemModel={this.showItemModel}
              />
            </Box>
          </div>
        )}
      </>
    );
  }
}

export default withParams(Dashboard);
