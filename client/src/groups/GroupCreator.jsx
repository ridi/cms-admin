import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default class GroupCreator extends React.Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleIsUseChange = this.handleIsUseChange.bind(this);

    this.state = {
      name: '',
      isUse: '1',
    };
  }

  handleSave() {
    this.props.onCreateGroup(this.state.name, this.state.isUse);
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value,
    });
  }

  handleIsUseChange(event) {
    this.setState({
      isUse: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <h4>그룹 등록</h4>
        <table className="table table-bordered">
          <colgroup>
            <col width="200" />
            <col width="80" />
          </colgroup>
          <thead>
            <tr>
              <th>그룹 이름</th>
              <th>사용 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="text" className="input-block-level" name="name" value={this.state.name} onChange={this.handleNameChange} />
              </td>
              <td>
                <select className="input-block-level" name="is_use" value={this.state.isUse} onChange={this.handleIsUseChange} >
                  <option value="1">Y</option>
                  <option value="0">N</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-right">
          <Button className="btn-primary" onClick={this.handleSave}>저장</Button>
        </div>
      </div>
    );
  }
}

GroupCreator.propTypes = {
  onCreateGroup: PropTypes.string.isRequired,
};
