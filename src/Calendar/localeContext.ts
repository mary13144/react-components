import { createContext } from "react"

export interface LocaleCalendarType{
    locale:string
}

const LocalContext = createContext<LocaleCalendarType>({
    locale:'zh-CN'
})


export default LocalContext
