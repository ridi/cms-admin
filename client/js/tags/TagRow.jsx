import React from 'react';
import { Button } from 'react-bootstrap';

const TagRow = (props) => {
  const { id, isUse, name, creator, createdAt, updatedAt, menusCount, usersCount,
    onMenusCountClick, onUsersCountClick } = props;

  return (
    <tr id={id} className={!isUse ? 'danger' : ''}>
      <td>
        <input type="checkbox" name="changed" />
        <input type="hidden" name="id" value={id} />
      </td>
      <td>{id}</td>
      <td><input type="text" className="input-block-level" name="name" defaultValue={name} /></td>
      <td>{creator}</td>
      <td>
        <input type="checkbox" className="input-block-level" name="is_use" defaultChecked={isUse} />
      </td>
      <td>{createdAt}</td>
      <td>{updatedAt}</td>
      <td>
        <Button onClick={onMenusCountClick}>{menusCount}</Button>
      </td>
      <td>
        <Button onClick={onUsersCountClick}>{usersCount}</Button>
      </td>
    </tr>
  );
};

TagRow.propTypes = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  creator: React.PropTypes.string,
  isUse: React.PropTypes.bool,
  createdAt: React.PropTypes.string,
  updatedAt: React.PropTypes.string,
  menusCount: React.PropTypes.number,
  usersCount: React.PropTypes.number,
  onMenusCountClick: React.PropTypes.func,
  onUsersCountClick: React.PropTypes.func,
};

export default TagRow;
