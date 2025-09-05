import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";

export default class OptionForm extends React.Component {
  state = {
    modifyGroupMaxMap: new Map(),
    modifyGroupSelectedMap: new Map(),
    errorMap: new Map(),
    itemId: "",
  };

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.itemId !== props.itemId) {
      current_state.itemId = props.itemId;
      const { modifyGroups } = props;
      return {
        modifyGroupMaxMap: new Map(modifyGroups.map((x) => [x.id, x.maxSelection])),
        errorMap: new Map(modifyGroups.map((x) => [x.id, false])),
        modifyGroupSelectedMap: new Map(modifyGroups.map((x) => [x.id, []])),
      };
    }
  }

  componentDidMount() {
    const { modifyGroups } = this.props;
    this.setState({ modifyGroupMaxMap: new Map(modifyGroups.map((x) => [x.id, x.maxSelection])) });
    this.setState({ errorMap: new Map(modifyGroups.map((x) => [x.id, false])) });
    this.setState({ modifyGroupSelectedMap: new Map(modifyGroups.map((x) => [x.id, []])) });
  }

  handleChange = (groupId, optionId) => (event) => {
    const modifyGroupSelectedMap = this.state.modifyGroupSelectedMap;
    const errorMap = this.state.errorMap;
    var selected = this.state.modifyGroupSelectedMap.get(groupId);

    if (event.target.checked) {
      if (!selected.includes(optionId)) {
        if (this.state.modifyGroupMaxMap.get(groupId) === 1) {
          selected = [optionId];
        } else {
          selected.push(optionId);
        }
        if (selected.length > this.state.modifyGroupMaxMap.get(groupId)) {
          this.state.errorMap.set(groupId, true);
        }
      }
    } else {
      selected.pop(optionId);
      if (selected.length <= this.state.modifyGroupMaxMap.get(groupId)) {
        this.state.errorMap.set(groupId, false);
      }
    }
    modifyGroupSelectedMap.set(groupId, selected);
    this.setState({ errorMap: errorMap, modifyGroupSelectedMap: modifyGroupSelectedMap });
    this.props.handleOptionChange(modifyGroupSelectedMap);
  };

  render = () => {
    const { modifyGroups } = this.props;
    return (
      <FormControl>
        {modifyGroups.map((group) =>
          group.maxSelection === 1 && group.minSelection === 1 ? (
            <React.Fragment>
              <FormControl variant="standard">
                <FormLabel id={group.name}>{group.name}</FormLabel>
                <RadioGroup row aria-labelledby={group.name} name="radio-buttons-group">
                  {group.modifierOptions.map((option) => (
                    <FormControlLabel value={option.id} control={<Radio onChange={this.handleChange(group.id, option.id)} />} label={option.name} />
                  ))}
                </RadioGroup>
              </FormControl>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FormControl error={this.state.errorMap.get(group.id)}>
                <FormLabel id={group.name}>{group.name}</FormLabel>
                <FormGroup
                  sx={{
                    display: "inline-block",
                  }}
                >
                  {group.modifierOptions.map((option) => (
                    <FormControlLabel control={<Checkbox />} label={option.name} onChange={this.handleChange(group.id, option.id)} />
                  ))}
                </FormGroup>
                <FormHelperText>Pick no more than {group.maxSelection}</FormHelperText>
              </FormControl>
            </React.Fragment>
          )
        )}
      </FormControl>
    );
  };
}
