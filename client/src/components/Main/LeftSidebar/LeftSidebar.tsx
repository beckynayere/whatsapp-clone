import React, { useContext, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";
import { useHistory } from "react-router-dom";
import { User } from "../../../interfaces/interfaces";
import { List, ListItem, Avatar, ListItemAvatar, IconButton, InputBase, Typography, Divider, Menu, MenuItem, ClickAwayListener } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDownWardIcon from "@material-ui/icons/ArrowDownward";
import "./LeftSidebar.scss";

interface Props {
  users: User[];
  setSelectedUser: (user: User) => void;
}

const DotsIcon = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const history: any = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="logout-menu"
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

const LeftSidebar: React.FC<Props> = ({ users, setSelectedUser }) => {
  const { loggedInUser, displayMessageTime } = useContext(AppContext);
  const [searchBarIsOpened, setSearchBarIsOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="left-sidebar">
      <div className="actions">
        <div className="icons">
          <div className="left-side">
            <Avatar className="avatar" alt="avatar" src={loggedInUser?.image} />
          </div>
          <div className="right-side">
            {[DonutLargeIcon, ChatIcon, DotsIcon].map((Icon, index) => (
              <React.Fragment key={index}>
                {index < 2 ?
                  <IconButton>
                    <Icon />
                  </IconButton> :
                  <Icon />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className={"form-wrapper " + (searchBarIsOpened ? "white" : "")}>
          <ClickAwayListener onClickAway={() => setSearchBarIsOpened(false)}>
            <form>
              <div className="search-wrapper">
                <div className="icon-wrapper">
                  {searchBarIsOpened ? <ArrowDownWardIcon className="is-arrow" /> : <SearchIcon />}
                </div>
                <div className="input-wrapper">
                  <InputBase
                    className="input-base"
                    inputProps={{ "aria-label": "search" }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClick={() => setSearchBarIsOpened(!searchBarIsOpened)}
                    placeholder={searchBarIsOpened ? "" : "Search or start new chat"}
                  />
                </div>
              </div>
            </form>
          </ClickAwayListener>
        </div>
      </div>
      <List className="users">
        {users?.filter(user => `${user.firstName} ${user.lastName}`.toUpperCase().includes(searchValue.toUpperCase())).map((user, index) => (
          <React.Fragment key={index}>
            <ListItem button className="list-item" onClick={() => setSelectedUser({ ...user })}>
              <ListItemAvatar className="avatar-wrapper">
                <Avatar className="avatar" alt="avatar" src={user?.image} />
              </ListItemAvatar>
              <div className="text-wrapper">
                {index > 0 && <Divider className={user.latestMessage?.createdAt ? "is-chatted" : ""} />}
                <div className="first-row">
                  <Typography component="span" className="fullname">{`${user.firstName} ${user.lastName}`}</Typography>
                  <Typography component="small">{displayMessageTime(user.latestMessage?.createdAt)}</Typography>
                </div>
                <div className="second-row">
                  <Typography className="last-message" component="span">{user.latestMessage?.content}</Typography>
                </div>
              </div>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default LeftSidebar;