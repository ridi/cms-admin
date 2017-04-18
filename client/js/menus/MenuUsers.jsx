import React from 'react';
import {Modal} from 'react-bootstrap/lib';
import axios from 'axios';


class UserRow extends React.Component {
  render() {
    return (
      <div>
        <a href={`/super/users/${this.props.id}`}>
          {this.props.name}({this.props.id})
        </a>
      </div>
    );
  }
}

class MenuUsersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios.get(`/super/menus/${this.props.menuId}/users`)
      .then(res => {
        console.log(res);
        this.setState({users: res.data.data});
      }).catch(err => {
        console.log(err);
      });
  }

  render() {
    const userRows = this.state.users.map(user =>
      <UserRow key={user.id} id={user.id} name={user.name}/>
    );

    return (
      <div>
        {userRows}
      </div>
    );
  }
}

export default class MenuUsers extends React.Component {
  render() {
    return (
      <div>
        <Modal show={this.props.showModal}>
          <Modal.Header>
            <h4>메뉴 사용자 목록</h4>
          </Modal.Header>
          <Modal.Body>
           <MenuUsersTable menuId={this.props.menuId}/>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default btn-sm" onClick={this.props.closeModal}>Close</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
