import InstallPrompt from "./components/InstallPrompt"
import ToDos from "./components/Todos"
import { serviceWorkerPopUp } from "./utils/_serviceWorkerPopUp"

function App() {
  serviceWorkerPopUp()
  return (
    <>
      <InstallPrompt />
      <ToDos />
    </>
  )
}

export default App
