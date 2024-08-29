import InfoIcon from "@mui/icons-material/Info";

const InfoToolTip = () => {
  return (
    <div className="relative group">
      <InfoIcon className="cursor-pointer" />
      <span className="absolute right-0 transform translate-y-[-115%] mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded-md whitespace-no-wrap">
        These tasks are ranked by importance based on our job transition model.
        The model identifies key tasks that significantly contribute to
        successful transitions based on historical data from
        previous job changes.
      </span>
    </div>
  );
};

export default InfoToolTip;
