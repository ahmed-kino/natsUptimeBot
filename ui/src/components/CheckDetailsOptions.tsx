import * as React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Tooltip } from "@mui/material";
import { ModeEdit } from "@mui/icons-material";

interface ActionButtonsProps {
  onDelete: () => void;
  onEdit: () => void;
  onPause: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDelete,
  onEdit,
  onPause,
}) => {
  return (
    <div>
      <Tooltip key="pause" title="Pause">
        <IconButton color="default" aria-label="Pause" onClick={onPause}>
          <PauseIcon />
        </IconButton>
      </Tooltip>
      <Tooltip key="resume" title="Resume">
        <IconButton color="success" aria-label="Resume" onClick={onPause}>
          <PlayArrowIcon />
        </IconButton>
      </Tooltip>

      <Tooltip key="edit" title="Edit">
        <IconButton color="default" aria-label="Edit" onClick={onEdit}>
          <ModeEdit />
        </IconButton>
      </Tooltip>

      <Tooltip key="delete" title="Delete">
        <IconButton color="error" aria-label="Delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const CheckDetailsOptions: React.FC<ActionButtonsProps> = ({
  onDelete,
  onEdit,
  onPause,
}) => {
  return (
    <ButtonGroup size="small" aria-label="small button group">
      <ActionButtons onDelete={onDelete} onEdit={onEdit} onPause={onPause} />
    </ButtonGroup>
  );
};

export default CheckDetailsOptions;
