import React from 'react';
import {Modal} from 'react-bootstrap/lib';


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
    fetch(`/super/menus/${this.props.menuId}/users`, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response);
        }
      })
      .then(json => {
        this.setState({users: json.data});
      }).catch(err => {
        console.log(err);
      });
  }

  render() {
    const userRows = this.state.users.map(
      user => <UserRow key={user.id} id={user.id} name={user.name}/>
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
