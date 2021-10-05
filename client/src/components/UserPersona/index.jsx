import { Persona, PersonaSize } from "@fluentui/react"
import style from './styles'

const UserPersona = () => {

    return (
        <Persona styles={style} text="Abdelmounaim Bousmat" size={PersonaSize.size32} />
    )
}

export default UserPersona