#!/usr/bin/env node
import { getArgs } from './helpers/args.helper.js'
import {
    printHelp,
    printSuccess,
    printError,
    printWeather,
} from './services/log.service.js'
import {
    saveKeyValue,
    TOKEN_DICTIONARY,
    getKeyValue,
} from './services/storage.service.js'
import { getWeather, getIcon } from './services/api.service.js'

const saveToken = async (token) => {
    if (!token.length) {
        printError('Token has not been provided')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token)
        printSuccess('Token has been saved successfully.')
    } catch (e) {
        printError(e.message)
    }
}

const saveCity = async (city) => {
    if (!city.length) {
        printError('City has not been provided')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city)
        printSuccess('City has been saved successfully.')
    } catch (e) {}
}

const getForecast = async () => {
    try {
        const city = await getKeyValue(TOKEN_DICTIONARY.city)
        const weather = await getWeather(city)
        printWeather(weather, getIcon(weather.weather[0].icon))
    } catch (e) {
        if (e?.response?.status === 404) {
            printError('Invalid city')
        } else if (e?.response?.status === 401) {
            printError('Invalid token')
        } else {
            printError(e.message)
        }
    }
}

const initCLI = () => {
    const args = getArgs(process.argv)
    if (args.h) {
        return printHelp()
    }
    if (args.s) {
        return saveCity(args.s)
    }
    if (args.t) {
        return saveToken(args.t)
    }
    return getForecast()
}

initCLI()
