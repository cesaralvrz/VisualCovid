// Importamos los componentes.
import AcercaDe from './components/AcercaDe'
import Inicio from './components/Inicio'
import Datos from './components/Datos'
import Vacunas from './components/Vacunas'

// Asignamos una ruta a cada uno de ellos.
export default [
    {path: "/", component: Inicio},
    {path: "/acercade", component: AcercaDe},
    {path: "/datos", component: Datos},
    {path: "/vacunas", component: Vacunas},
]



