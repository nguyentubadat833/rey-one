const sidebarOpen = ref(false)
const mobileSidebarOpen = ref(false)
const expandedMenus = ref<string[]>([])

export default function useUI() {

    function toggleSidebar() {
        sidebarOpen.value = !sidebarOpen.value
    }

    function openMobileSidebar() {
        mobileSidebarOpen.value = true;
    }

    function closeMobileSidebar() {
        mobileSidebarOpen.value = false;
    }

    function isMenuExpanded(label: string) {
        return expandedMenus.value.includes(label);
    }

    function expandMenu(label: string) {
        if (!expandedMenus.value.includes(label)) {
            expandedMenus.value.push(label);
        }
    }

    function collapseMenu(label: string) {
        expandedMenus.value = expandedMenus.value.filter((item) => item !== label);
    }

    function toggleMenu(label: string) {
        if (expandedMenus.value.includes(label)) {
            collapseMenu(label);
        } else {
            expandMenu(label);
        }
    }

    return {
        sidebarOpen,
        mobileSidebarOpen,
        expandedMenus,

        toggleSidebar,
        openMobileSidebar,
        closeMobileSidebar,
        isMenuExpanded,
        expandMenu,
        collapseMenu,
        toggleMenu
    }
}