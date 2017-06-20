import 'babel-polyfill';
import React from 'react';
import { Modal } from 'react-bootstrap/lib';
import PropTypes from 'prop-types';
import axios from 'axios';

function UserRow(props) {
  return (
    <div>
      <a href={`/super/users/${props.id}`}>
        {props.name}({props.id})
      </a>
    </div>
  );
}

UserRow.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

class MenuUsersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: [],
    };
  }

  async componentDidMount() {
    this.updateMenuUsers();
  }

  async getMenuUsers() {
    const { data: data } = await axios.get(`/super/menus/${this.props.menuId}/users`);
    return data;
  }

  async updateMenuUsers() {
    const users = await this.getMenuUsers();
    this.setState({
      users,
      loading: false,
    });
  }

  render() {
    const userRows = this.state.users.map(user =>
      <UserRow key={user.id} id={user.id} name={user.name} />,
    );

    return (
      <div>
        { this.state.loading ? 'loading...' : userRows }
      </div>
    );
  }
}

MenuUsersTable.propTypes = {
  menuId: PropTypes.number.isRequired,
};

export default function MenuUsers(props) {
  return (
    <div>
      <Modal show={props.showModal}>
        <Modal.Header>
          <h4>메뉴 사용자 목록</h4>
        </Modal.Header>
        <Modal.Body>
          <MenuUsersTable menuId={props.menuId} />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default btn-sm" onClick={props.closeModal}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

MenuUsers.propTypes = {
  menuId: PropTypes.number.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};
