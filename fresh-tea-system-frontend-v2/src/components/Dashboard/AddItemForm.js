import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import Fab from "@mui/material/Fab";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import OptionForm from "./OptionForm";

export default class AddItemForm extends React.Component {
  state = {
    category: "",
    name: "",
    item: "",
    displayItem: "",
    modifyGroups: [],
    mappedModifyGroup: "",
    mappedItem: "",
    items: "",
    filteredItems: "",
    modifyGroupSelectedMap: "",
    remark: "",
    isCreate: false,
    editOrderId: null,
  };

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.mappedItem && props.editOrder && props.editOrder.id !== current_state.editOrderId) {
      current_state.editOrderId = props.editOrder.id;
      current_state.name = props.editOrder.user;
      current_state.category = props.editOrder.categoryId;
      current_state.filteredItems = props.items.filter((x) => x.available && Number(x.categoryId) === props.editOrder.categoryId);
      current_state.displayItem = current_state.mappedItem.get(String(props.editOrder.itemId)).name;
      current_state.item = current_state.mappedItem.get(String(props.editOrder.itemId));
      current_state.modifyGroups = current_state.item.modifierGroupIds.map((x) => current_state.mappedModifyGroup.get(x));
    }
  }

  componentDidMount() {
    const mappedModifyGroup = new Map(this.props.modifierGroups.map((x) => [x.id, x]));
    const mappedItem = new Map(this.props.items.map((x) => [x.id, x]));
    this.setState({ mappedModifyGroup: mappedModifyGroup, mappedItem: mappedItem });
  }
  onOpenModal = () => {
    this.props.showItemModel(true);
    this.setState({ isCreate: true });
  };

  onCloseModal = () => {
    this.setState({ name: "", displayItem: "", category: "", item: "", isCreate: false, editOrderId: null });
    this.props.showItemModel(false);
  };

  handleChange = (prop) => (event) => {
    if (prop === "item") {
      this.setState({ displayItem: this.state.mappedItem.get(event.target.value).name });
      this.setState({ item: this.state.mappedItem.get(event.target.value) });
      this.setState({ modifyGroups: this.state.mappedItem.get(event.target.value).modifierGroupIds.map((x) => this.state.mappedModifyGroup.get(x)) });
    } else {
      this.setState({ [prop]: event.target.value });
    }
  };

  handleCategoryChange = (prop) => (event) => {
    const filteredItems = this.props.items.filter((x) => x.available && x.categoryId === event.target.value);
    this.setState({ category: event.target.value, filteredItems: filteredItems, modifyGroups: [] });
  };

  handleOptionChange = (modifyGroupSelectedMap) => {
    this.setState({ modifyGroupSelectedMap: modifyGroupSelectedMap });
  };

  handleNameChange = (prop) => (event, values) => {
    if (typeof values === 'string') {
      this.setState({ name: values });
    } else {
      this.setState({ name: values.label });
    }
  };
  formSubmitHandler = (e) => e.preventDefault();

  render = () => {
    const { open, categories, members, editOrder } = this.props;
    return (
      <>
        <Fab
          color="primary"
          onClick={this.onOpenModal}
          aria-label="Add"
          sx={{
            position: "fixed",
            right: "2rem",
            bottom: "2rem",
            zIndex: 9,
          }}
        >
          <AddIcon />
        </Fab>
        <Dialog open={open} onClose={this.onCloseModal}>
          <DialogTitle>{editOrder ? "Edit Order" : "Add Order"}</DialogTitle>
          <DialogContent>
            {/*Name*/}
            <Autocomplete
              freeSolo
              autoSelect
              disablePortal
              disabled={!this.state.isCreate}
              id="name-combo-box"
              options={members}
              sx={{ width: 300, margin: 1 }}
              value={this.state.name}
              onChange={this.handleNameChange("name")}
              renderInput={(params) => <TextField {...params} label="Name" />}
            />
            {/*Category*/}
            <TextField
              select
              label="Category"
              value={this.state.category}
              onChange={this.handleCategoryChange("category")}
              fullWidth={true}
              sx={{ width: 300, margin: 1 }}
              variant="standard"
            >
              {categories
                .filter((option) => {
                  return this.props.items.filter((x) => x.categoryId === option.id).length > 0;
                })
                .map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>

            {this.state.category ? (
              <TextField
                select
                label="Item"
                value={this.state.item.id}
                onChange={this.handleChange("item")}
                fullWidth={true}
                sx={{ width: 550, margin: 1 }}
                variant="standard"
              >
                {this.state.filteredItems.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} - {option.description}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
            {this.state.item ? (
              <OptionForm
                sx={{ width: 300, margin: 1 }}
                modifyGroups={this.state.modifyGroups}
                handleOptionChange={this.handleOptionChange}
                itemId={this.state.item.id}
              />
            ) : null}

            {/*Remark*/}
            <TextField
              id="remark"
              label="Remark"
              sx={{ width: 550, margin: 1 }}
              defaultValue={this.state.remark}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleChange("remark")}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onCloseModal}>Cancel</Button>
            <Button
              onClick={() => {
                if (this.state.name && this.state.category && this.state.item) {
                  this.onCloseModal();
                  return this.props.onAddOrder(this.state);
                } else {
                  console.log(this.state.name);
                  console.log(this.state.category);
                  console.log(this.state.item);
                  window.alert("Some value missing");
                }
              }}
              variant="contained"
              color="primary"
            >
              <AddIcon /> Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
}

