import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, InputGroup, FormControl, Glyphicon, Button } from 'react-bootstrap';

const SearchForm = (props) => {
  const { placeholder, onChangeText, onSearch } = props;
  return (
    <FormGroup>
      <InputGroup>
        <FormControl
          type="text"
          placeholder={placeholder}
          onChange={onChangeText}
          onKeyPress={e => (e.key === 'Enter' ? onSearch() : null)}
        />
        <InputGroup.Button>
          <Button onClick={onSearch}>
            <Glyphicon glyph="search" />
          </Button>
        </InputGroup.Button>
      </InputGroup>
    </FormGroup>
  );
};

SearchForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchForm;
