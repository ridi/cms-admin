import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Glyphicon, Grid, Pagination, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import SearchForm from '../common/searchForm';

const MAX_PAGE_BUTTON = 5;

class UserTable extends React.Component {
  constructor(props) {
    super();

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeSearchText = this.handleChangeSearchText.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);

    this.isSearched = false;

    this.state = {
      isLoading: true,
      activePage: 0,
      users: [],
      searchText: props.searchText,
    };
  }

  componentDidMount() {
    const { page, perPage } = this.props;
    this.setUserPage(page, perPage, this.state.searchText);
  }

  async setUserPage(pageIndex, perPage, searchText) {
    this.setState({ isLoading: true });

    try {
      const { data } = await axios.get(`/super/users?page=${pageIndex}&per_page=${perPage}&search_text=${searchText}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      const { users } = data;
      const pageEnd = Math.ceil(data.count / perPage);
      this.setState({
        users,
        pageEnd,
        activePage: pageIndex,
        isLoading: false,
      });
    } catch (e) {
      alert(e);
    }
  }

  handleSelect(page) {
    const { perPage } = this.props;
    this.setUserPage(page, perPage, this.state.searchText);
  }

  handleSearch() {
    this.isSearched = (this.state.searchText !== '');
    this.setUserPage(1, this.props.perPage, this.state.searchText);
  }

  handleChangeSearchText(e) {
    this.setState({ searchText: e.target.value });
  }

  handleAddUser() {
    window.location = '/super/users/new';
  }

  renderRows() {
    const { isLoading, users } = this.state;

    if (isLoading && users.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="center">불러오는 중입니다..</td>
        </tr>
      );
    }

    if (!users || users.length === 0) {
      const noDataText = this.isSearched ? '검색 결과가 없습니다.' : '등록된 어드민 계정이 없습니다.';
      return (
        <tr>
          <td colSpan={4} className="center">{noDataText}</td>
        </tr>
      );
    }

    return users.map(user => (
      <tr key={user.id} className={user.is_use !== '1' ? 'danger' : undefined}>
        <td>{user.id}</td>
        <td><a href={`/super/users/${user.id}`}>{user.name}</a></td>
        <td>{user.team}</td>
        <td>{user.is_use === '1' ? 'Y' : 'N'}</td>
      </tr>
    ));
  }

  render() {
    return (
      <Grid bsClass="">
        <Row>
          <Col lg={1}>
            <Button bsStyle="primary" bsSize="small" onClick={this.handleAddUser}>
              <Glyphicon glyph="download-alt" />&nbsp;신규 등록
            </Button>
          </Col>
          <Col lg={3} lgOffset={8}>
            <SearchForm
              placeholder="ID / 이름"
              onChangeText={this.handleChangeSearchText}
              onSearch={this.handleSearch}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Table bordered condensed hover>
              <colgroup>
                <col width="150" />
                <col width="" />
                <col width="200" />
                <col width="80" />
              </colgroup>
              <thead>
                <tr>
                  <th>계정 ID</th>
                  <th>이름</th>
                  <th>팀</th>
                  <th>사용여부</th>
                </tr>
              </thead>
              <tbody>
                { this.renderRows() }
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="text-center">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              items={this.state.pageEnd}
              maxButtons={MAX_PAGE_BUTTON}
              activePage={this.state.activePage}
              onSelect={this.handleSelect}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

UserTable.propTypes = {
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  searchText: PropTypes.string.isRequired,
};

export default UserTable;
