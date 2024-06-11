import React, { useState } from 'react';
import styled from 'styled-components';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const CategoryDropdown = ({ categories, onCategorySelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedCategory, setSelectedCategory] = useState('Mock')

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
    handleClose();
  };

  return (
    <div>
      <DropFilter onClick={handleClick}>{selectedCategory} ▼</DropFilter>
      <Menu
        id="category-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'category-button',
        }}
      >
        {categories.map((category, index) => (
          <MenuItem key={index} onClick={() => handleCategorySelect(category)}>
            {category}
          </MenuItem>
        ))}
        <MenuItem onClick={() =>  handleCategorySelect("Mock")}>Mock</MenuItem>
        {/* <MenuItem onClick={() =>  handleCategorySelect('')}>All</MenuItem> */}
      </Menu>
    </div>
  );
};

const DropFilter = styled.div`
  font-family: poppins;
  display: flex;
  padding: 10px 20px;
  border-radius: 20px;
  border: 2px solid #6a5ae0;
  color: #6a5ae0;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default CategoryDropdown;