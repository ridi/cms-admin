import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select2Input from '../components/Select2Input';

class UserGroupForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleGroupAdd = this.handleGroupAdd.bind(this);
    this.handleGroupRemove = this.handleGroupRemove.bind(this);

    this.state = {
      groupFetching: true,
      assignedGroups: props.userGroup,
      groups: [],
    };
  }

  async componentDidMount() {
    await this.updateGroups();
  }

  async getGroups() {
    const { data } = await axios('/super/groups');
    return data;
  }

  async updateGroups() {
    const groups = await this.getGroups();
    if (groups) {
      this.setState({
        groups: groups.map(group => ({ id: group.id, text: group.name })),
        groupFetching: false,
      });
    } else {
      this.setState({
        groupFetching: false,
      });
    }
  }

  handleGroupAdd(id) {
    fetch(`/super/groups/${id}/users?user_id=${this.props.id}`, {
      method: 'POST',
    }).then(() => {
    }).catch(err => alert(err));

    this.setState({
      assignedGroups: this.state.assignedGroups.concat(id),
    });
  }

  handleGroupRemove(id) {
    fetch(`/super/groups/${id}/users/${this.props.id}`, {
      method: 'DELETE',
    }).then(() => {
    }).catch(err => alert(err));

    const targetIndex = this.state.assignedGroups.indexOf(id);
    if (targetIndex !== -1) {
      this.setState({
        assignedGroups: this.state.assignedGroups.filter((_, i) => i !== targetIndex),
      });
    }
  }

  renderLoading() {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" style={{ width: '100%' }}>로딩중...</div>
      </div>
    );
  }

  renderGroupInput(inputId) {
    const { id } = this.props;
    const { assignedGroups, groups } = this.state;

    return (
      <Select2Input
        id={inputId}
        value={assignedGroups}
        data={groups}
        multiple
        placeholder="그룹을 지정하세요"
        disabled={!id}
        onAdd={this.handleGroupAdd}
        onRemove={this.handleGroupRemove}
      />
    );
  }

  render() {
    const { id } = this.props;
    const { groupFetching } = this.state;

    return (
      <form className="form-horizontal" id="permissions" action={`/super/users/${id}/permissions`} method="POST">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">유저 그룹 관리</h4>
          </div>
          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label" htmlFor="group_ids">그룹</label>
              <div className="col-xs-10">
                {groupFetching ? this.renderLoading() : this.renderGroupInput('group_ids')}
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

UserGroupForm.propTypes = {
  id: PropTypes.string.isRequired,
  userGroup: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UserGroupForm;
