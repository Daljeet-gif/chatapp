import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { AudioFile, Image, UploadFile, VideoFile } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";
const FileMenu = ({ anchorE1, chatId }) => {
  const dispatch = useDispatch();
  const { isFileMenu } = useSelector((state) => state.misc);

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.lenght <= 0) return;

    if (files.length > 5)
      return toast.error(`you can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);

      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      console.log(res);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`failed to send ${key}`, { id: toastId });
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };
  return (
    <Menu open={isFileMenu} anchorEl={anchorE1} onClose={closeFileMenu}>
      <div
        style={{
          width: "10rem",
        }}
      >
        {" "}
        <MenuList>
          <MenuItem onClick={selectImage}>
            <Tooltip title="Image">
              <Image></Image>
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg,image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={selectAudio}>
            <Tooltip title="Audio">
              <AudioFile></AudioFile>
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              ref={audioRef}
              onChange={(e) => fileChangeHandler(e, "Audios")}
            />
          </MenuItem>
          <MenuItem onClick={selectVideo}>
            <Tooltip title="Video">
              <VideoFile></VideoFile>
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              ref={videoRef}
              onChange={(e) => fileChangeHandler(e, "Videos")}
            />
          </MenuItem>
          <MenuItem onClick={selectFile}>
            <Tooltip title="File">
              <UploadFile></UploadFile>
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="all"
              style={{ display: "none" }}
              ref={fileRef}
              onChange={(e) => fileChangeHandler(e, "Files")}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
