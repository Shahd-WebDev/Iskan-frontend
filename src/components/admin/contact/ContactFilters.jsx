export default function ContactFilters({
  activeTab,
  setActiveTab,
  setCurrentPage,
}) {
  const changeTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="cm-filters">

      <button
        className={
          activeTab === "all"
            ? "cm-filter-btn cm-filter-btn-active"
            : "cm-filter-btn"
        }
        onClick={() => changeTab("all")}
      >
        All
      </button>

      <button
        className={
          activeTab === "replied"
            ? "cm-filter-btn cm-filter-btn-active"
            : "cm-filter-btn"
        }
        onClick={() => changeTab("replied")}
      >
        Replied
      </button>

      <button
        className={
          activeTab === "unreplied"
            ? "cm-filter-btn cm-filter-btn-active"
            : "cm-filter-btn"
        }
        onClick={() => changeTab("unreplied")}
      >
        Unreplied
      </button>

    </div>
  );
}