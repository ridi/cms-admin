import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select2Input from '../components/Select2Input';

class UserGroupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: null,
      groupsAssigned: [],
      groupsFetching: true,
      tags: [],
      tagsInherited: null,
    };
  }

  async componentDidMount() {
    await this.fetchAllTags();
    this.fetchTagsInheritedFromGroups();
    await this.fetchGroupsAssigned();
    this.fetchAllGroups();
  }

  async fetchAllGroups() {
    const { data } = await axios.get('/super/groups', {
      headers: {
        Accept: 'application/json',
      },
    });

    this.setState({
      groups: data && data.map(group => ({ id: group.id, text: group.name })),
    });
  }

  async fetchGroupsAssigned() {
    this.setState({
      groupsFetching: true,
    });

    const { data } = await axios.get(`/super/users/${this.props.id}/groups`, {
      headers: {
        Accept: 'application/json',
      },
    });
    this.setState({
      groupsAssigned: data || [],
      groupsFetching: false,
    });
  }

  async fetchAllTags() {
    const { data } = await axios.get('/super/tags', {
      headers: {
        Accept: 'application/json',
      },
    });

    this.setState({
      tags: data && data.map(tag => ({ id: tag.id, text: tag.name })),
    });
  }

  async fetchTagsInheritedFromGroups() {
    const { data } = await axios.get(`/super/users/${this.props.id}/tags/inherited`, {
      headers: {
        Accept: 'application/json',
      },
    });

    this.setState({
      tagsInherited: data,
    });
  }

  handleGroupAdd = async (id) => {
    this.setState({
      tagsInherited: null,
      groupsFetching: true,
    });

    await axios.post(`/super/groups/${id}/users`, { user_id: this.props.id });
    this.fetchTagsInheritedFromGroups();
    this.fetchGroupsAssigned();
  }

  handleGroupRemove = async (id) => {
    this.setState({
      tagsInherited: null,
      groupsFetching: true,
    });

    await axios.delete(`/super/groups/${id}/users/${this.props.id}`);
    this.fetchTagsInheritedFromGroups();
    this.fetchGroupsAssigned();
  }

  renderLoading() {
    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" style={{ width: '100%' }}>로딩중...</div>
      </div>
    );
  }

  renderGroupInput(inputId) {
    const { groupsAssigned, groups, groupsFetching } = this.state;

    return (
      <Select2Input
        id={inputId}
        value={groupsAssigned || []}
        data={groups}
        multiple
        placeholder="그룹을 지정하세요"
        disabled={groupsFetching}
        onAdd={this.handleGroupAdd}
        onRemove={this.handleGroupRemove}
      />
    );
  }

  renderTagInput(inputId) {
    const { tags, tagsInherited } = this.state;

    return (
      <Select2Input
        id={inputId}
        value={tagsInherited}
        data={tags}
        multiple
        placeholder="상속된 태그가 없습니다."
        disabled
      />
    );
  }

  render() {
    const allGroupFetching = this.state.groups === null;
    const tagFetching = this.state.tagsInherited === null;

    return (
      <form className="form-horizontal">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4 className="panel-title">유저 그룹 관리</h4>
          </div>
          <div className="panel-body">
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label text-right" htmlFor="group_ids">그룹</label>
              <div className="col-xs-10">
                {allGroupFetching ? this.renderLoading() : this.renderGroupInput('group_ids')}
              </div>
            </div>
            <div className="form-group form-group-sm">
              <label className="col-xs-2 control-label text-right" htmlFor="tag_ids">상속된 태그</label>
              <div className="col-xs-10">
                {tagFetching ? this.renderLoading() : this.renderTagInput('tag_ids')}
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
};

export default UserGroupForm;
