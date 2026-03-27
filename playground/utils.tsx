import { type Ship } from './api.server.ts'

export type { Ship }

const shipCache = new Map<string, Promise<Ship>>()

export function getShip(name: string, delay?: number) {
	console.log(`getShip() called with ${name}`)

	const shipPromise = shipCache.get(name) ?? getShipImpl(name, delay)

	shipCache.set(name, shipPromise)

	return shipPromise
}

async function getShipImpl(name: string, delay?: number) {
	console.log(`getShipImpl() called with ${name}`)

	const searchParams = new URLSearchParams({ name })
	
	if (delay) searchParams.set('delay', String(delay))
	
	const response = await fetch(`api/get-ship?${searchParams.toString()}`)
	
	if (!response.ok) {
		return Promise.reject(new Error(await response.text()))
	}
	
	const ship = await response.json()
	return ship as Ship
}

const imgCache = new Map<string, Promise<string>>()

export function imgSrc(src: string) {
	console.log(`imgSrc() called with src ${src}`)

	const imgPromise = imgCache.get(src) ?? preloadImage(src)
	
	imgCache.set(src, imgPromise)
	
	return imgPromise
}

function preloadImage(src: string) {
	console.log(`preloadImage() called with ${src}`)

	return new Promise<string>(async (resolve, reject) => {
		const img = new Image()
		img.src = src
		img.onload = () => resolve(src)
		img.onerror = reject
	})
}

// added the version to prevent caching to make testing easier
const version = Date.now()

export function getImageUrlForShip(
	shipName: string,
	{ size }: { size: number },
) {
	console.log(`getImageUrlForShip() for ship = ${shipName} called`)

	// return `/img/ships/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}&version=${version}`
	// 🧝‍♂️ This is just here for us to test what happens when the image fails to load
	const intentionalTypoUrl = `/img/typo/${shipName.toLowerCase().replaceAll(' ', '-')}.webp?size=${size}&version=${version}`
	return intentionalTypoUrl
}
