import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import SearchForm from '../components/SearchForm';
import UserDetailForm from './UserDetailForm';
import UserPermissionForm from './UserPermissionForm';
import UserCpForm from './UserCpForm';

class UserEditApp extends React.Component {
  constructor() {
    super();

    this.state = {
      searchText: '',
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangeSearchText = this.handleChangeSearchText.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleDelete(id) {
    if (!window.confirm('삭제하시겠습니까?')) {
      return;
    }

    fetch(`/super/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(() => {
      alert('성공적으로 삭제되었습니다.');
      window.location.href = '/super/users';
    }).catch(e => alert(e));
  }

  handleChangeSearchText(e) {
    this.setState({ searchText: e.target.value });
  }

  handleSearch() {
    window.location = `/super/users?search_text=${this.state.searchText}`;
  }

  renderDetailForm() {
    let { userDetail } = this.props;
    if (!userDetail) {
      userDetail = {};
    }
    const { id, name, team } = userDetail;
    const isUse = userDetail.is_use;
    return (
      <UserDetailForm id={id} name={name} team={team} isUse={isUse} />
    );
  }

  renderPermissionForm() {
    if (!this.props.userDetail || !this.props.userDetail.id) {
      return null;
    }

    const userTag = this.props.userTag ? this.props.userTag.split(',') : [];
    const userMenu = this.props.userMenu ? this.props.userMenu.split(',') : [];
    return (
      <UserPermissionForm id={this.props.userDetail.id} userTag={userTag} userMenu={userMenu} />
    );
  }

  renderCpForm() {
    if (!this.props.userDetail || !this.props.userDetail.id) {
      return null;
    }

    return (
      <UserCpForm id={this.props.userDetail.id} />
    );
  }

  renderDeleteButton() {
    if (!this.props.userDetail || !this.props.userDetail.id) {
      return null;
    }

    return (
      <Button className="btn btn-default btn-danger pull-right" onClick={() => { this.handleDelete(this.props.userDetail.id); }}>삭제</Button>
    );
  }

  render() {
    return (
      <div>
        <SearchForm
          placeholder="다른 사용자 검색"
          onChangeText={this.handleChangeSearchText}
          onSearch={this.handleSearch}
        />

        <div className="col-xs-12 col-md-6">
          {this.renderDetailForm()}
        </div>

        <div className="col-xs-12 col-md-6">
          {this.renderPermissionForm()}
          {this.renderCpForm()}
        </div>

        <div className="col-xs-12 pull-right">
          {this.renderDeleteButton()}
        </div>
      </div>
    );
  }
}

UserEditApp.propTypes = {
  userDetail: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    team: PropTypes.string,
    is_use: PropTypes.string,
  }),
  userTag: PropTypes.string.isRequired,
  userMenu: PropTypes.string.isRequired,
};

UserEditApp.defaultProps = {
  userDetail: null,
};

export default UserEditApp;
