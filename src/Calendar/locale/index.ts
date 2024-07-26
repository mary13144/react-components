import { CalendarType } from "./interface";
import zhCN from './zh-CN'
import enUS from './en-US'

const allLocales: Record<string, CalendarType> = {
    'zh-CN': zhCN,
    'en-US': enUS
}

export default allLocales