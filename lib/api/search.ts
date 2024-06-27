import axios from "axios"
import { endpoint } from "../env"

export const searchAll = async(query: string) => {
    try {
        const response = await axios.get(`${endpoint}/search?field=all?query=${query}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const searchUsers = async (query: string) => {
    try {
        const response = await axios.get(`${endpoint}/search?field=users?query=${query}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}
export const searchPosts = async (query: string) => {
    try {
        const response = await axios.get(`${endpoint}/search?field=posts?query=${query}`)
        return  response.data
    } catch (error) {
        console.log(error)
    }
}
export const searchUserFiles = async (query: string) => {
    try {
        const response = await axios.get(`${endpoint}/search?field=userfiles?query=${query}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}
