import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Theme, CSSObject } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;
type SidebarItem = {
  name: string;
  path: string;
  icon: typeof SpaceDashboardOutlinedIcon | typeof CheckCircleOutlineIcon;
};
const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "Dashboard",
    path: "",
    icon: SpaceDashboardOutlinedIcon,
  },
  {
    name: "Checks",
    path: "checks",
    icon: CheckCircleOutlineIcon,
  },
];
const EXTRA_ITEMS: SidebarItem[] = [
  {
    name: "Extra stuff",
    path: "extra",
    icon: CheckCircleOutlineIcon,
  },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer)<{ open?: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type SideBarListItemProps = {
  sidebarItem: SidebarItem;
  open: boolean;
  selected: boolean;
  onItemClick: () => void;
};

const SideBarListItem: React.FC<SideBarListItemProps> = ({
  sidebarItem,
  open,
  selected,
  onItemClick,
}) => {
  const Icon = sidebarItem.icon;

  return (
    <ListItem
      key={sidebarItem.name}
      button
      component={Link}
      to={sidebarItem.path}
      sx={{
        minHeight: 48,
        justifyContent: open ? "initial" : "center",
        px: 2.5,
        backgroundColor: selected ? "#252525" : "transparent",
      }}
      onClick={onItemClick}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : "auto",
          justifyContent: "center",
        }}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText primary={sidebarItem.name} sx={{ opacity: open ? 1 : 0 }} />
    </ListItem>
  );
};

const SideDrawer: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>("Dashboard");
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawer = !open ? handleDrawerOpen : handleDrawerClose;

  const handleItemClick = (name: string) => {
    setSelectedItem(name);
  };

  useEffect(() => {
    const currentPath = location.pathname;

    const selectedItem = [...SIDEBAR_ITEMS, ...EXTRA_ITEMS].find((item) => {
      const unSlashedCurrentPath = currentPath.substring(1);
      if (item.path === "checks" && unSlashedCurrentPath !== "")
        return unSlashedCurrentPath.startsWith(item.path);
      return item.path === unSlashedCurrentPath;
    });

    if (selectedItem) {
      setSelectedItem(selectedItem.name);
    }
  }, [location]);

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawer}>
          {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {SIDEBAR_ITEMS.map((sidebarItem: SidebarItem) => (
          <SideBarListItem
            key={sidebarItem.name}
            sidebarItem={sidebarItem}
            open={open}
            selected={selectedItem === sidebarItem.name}
            onItemClick={() => handleItemClick(sidebarItem.name)}
          />
        ))}
      </List>
      <Divider />
      <List>
        {EXTRA_ITEMS.map((sidebarItem: SidebarItem) => (
          <SideBarListItem
            key={sidebarItem.name}
            sidebarItem={sidebarItem}
            open={open}
            selected={selectedItem === sidebarItem.name}
            onItemClick={() => handleItemClick(sidebarItem.name)}
          />
        ))}
      </List>
    </Drawer>
  );
};

export default SideDrawer;
