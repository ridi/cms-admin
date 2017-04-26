import React from 'react';
import PropTypes from 'prop-types';
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
  id: PropTypes.number,
  name: PropTypes.string,
  creator: PropTypes.string,
  isUse: PropTypes.bool,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  menusCount: PropTypes.number,
  usersCount: PropTypes.number,
  onMenusCountClick: PropTypes.func,
  onUsersCountClick: PropTypes.func,
};

export default TagRow;
