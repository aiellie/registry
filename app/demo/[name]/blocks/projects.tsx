import ProjectsPage from "@/app/demo/[name]/blocks/projects-page"
import ShellLayout from "@/app/demo/[name]/blocks/shell-layout"

export const projects = {
  name: "projects",
  components: {
    Default: (
      <ShellLayout activeHref="#chat-projects">
        <ProjectsPage />
      </ShellLayout>
    ),
  },
}
