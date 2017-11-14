import React from 'react';
import PropTypes from 'prop-types';

class Select2Input extends React.Component {
  componentDidMount() {
    const { onAdd, onRemove } = this.props;

    $(this.selectInput).select2();
    $(this.selectInput).on('select2:select', (e) => {
      const { data } = e.params;
      if (onAdd) {
        onAdd(data.id);
      }
    });

    $(this.selectInput).on('select2:unselect', (e) => {
      const { data } = e.params;
      if (onRemove) {
        onRemove(data.id);
      }
    });
  }

  componentWillUpdate(nextProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      $(this.selectInput).val(nextProps.value).trigger('change');
    }
  }

  renderOption(data) {
    return (
      <option key={data.id} value={data.id}>
        {data.text}
      </option>
    );
  }

  render() {
    const {
      value, id, placeholder, multiple, disabled,
    } = this.props;

    return (
      <div>
        <select
          ref={(input) => { this.selectInput = input; }}
          id={id}
          name={id}
          data-placeholder={placeholder}
          value={value}
          multiple={multiple}
          style={{ width: '100%' }}
          disabled={disabled}
          onChange={() => {}}
        >
          {this.props.data.map(this.renderOption)}
        </select>
      </div>
    );
  }
}

Select2Input.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    text: PropTypes.string,
  })),
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};

Select2Input.defaultProps = {
  value: [],
  data: [],
  placeholder: '',
  disabled: false,
  multiple: true,
  onAdd: undefined,
  onRemove: undefined,
};

export default Select2Input;
