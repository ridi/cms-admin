import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const TagRow = (props) => {
  const {
    id, isUse, name, creator, createdAt, updatedAt, menusCount,
    activeUsersCount, inactiveUsersCount, onMenusCountClick,
    onActiveUsersCountClick, onInactiveUsersCountClick,
  } = props;

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
        <Button onClick={onActiveUsersCountClick}>{activeUsersCount}</Button>
      </td>
      <td>
        <Button onClick={onInactiveUsersCountClick}>{inactiveUsersCount}</Button>
      </td>
    </tr>
  );
};

TagRow.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  isUse: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  menusCount: PropTypes.number.isRequired,
  activeUsersCount: PropTypes.number.isRequired,
  inactiveUsersCount: PropTypes.number.isRequired,
  onMenusCountClick: PropTypes.func.isRequired,
  onActiveUsersCountClick: PropTypes.func.isRequired,
  onInactiveUsersCountClick: PropTypes.func.isRequired,
};

export default TagRow;
