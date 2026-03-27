import { Suspense, use, useState, useTransition } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { useSpinDelay } from 'spin-delay'
import { getImageUrlForShip, getShip, imgSrc } from './utils.tsx'

function App() {
	console.log(`App component logic start`)

	const [shipName, setShipName] = useState('Dreadnought')
	const [isTransitionPending, startTransition] = useTransition()
	const isPending = useSpinDelay(isTransitionPending, {
		delay: 300,
		minDuration: 350,
	})

	function handleShipSelection(newShipName: string) {
		console.log('handleShipSelection called')

		startTransition(() => {
			console.log('startTransition called')

			setShipName(newShipName)
		})
	}

	console.log(`App component rendering`)

	return (
		<div className="app-wrapper">
			<ShipButtons shipName={shipName} onShipSelect={handleShipSelection} />
			<div className="app">
				<div className="details" style={{ opacity: isPending ? 0.6 : 1 }}>
					<ErrorBoundary fallback={<ShipError shipName={shipName} />}>
						<Suspense fallback={<ShipFallback shipName={shipName} />}>
							<ShipDetails shipName={shipName} />
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	)
}

function ShipButtons({
	shipName,
	onShipSelect,
}: {
	shipName: string
	onShipSelect: (shipName: string) => void
}) {
	console.log(`ShipButtons component logic start`)

	const ships = ['Dreadnought', 'Interceptor', 'Galaxy Cruiser']

	console.log(`ShipButtons component rendering`)

	return (
		<div className="ship-buttons">
			{ships.map((ship) => (
				<button
					key={ship}
					onClick={() => onShipSelect(ship)}
					className={shipName === ship ? 'active' : ''}
				>
					{ship}
				</button>
			))}
		</div>
	)
}

function ShipDetails({ shipName }: { shipName: string }) {
	console.log(`ShipDetails component logic start`)

	const ship = use(getShip(shipName))

	console.log(`ShipDetails component rendering`)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				{/* 🐨 change this to the ShipImg component */}
				<ShipImg
					src={getImageUrlForShip(ship.name, { size: 200 })}
					alt={ship.name}
				/>
			</div>
			<section>
				<h2>
					{ship.name}
					<sup>
						{ship.topSpeed} <small>lyh</small>
					</sup>
				</h2>
			</section>
			<section>
				{ship.weapons.length ? (
					<ul>
						{ship.weapons.map((weapon) => (
							<li key={weapon.name}>
								<label>{weapon.name}</label>:{' '}
								<span>
									{weapon.damage} <small>({weapon.type})</small>
								</span>
							</li>
						))}
					</ul>
				) : (
					<p>NOTE: This ship is not equipped with any weapons.</p>
				)}
			</section>
			<small className="ship-info__fetch-time">{ship.fetchedAt}</small>
		</div>
	)
}

function ShipFallback({ shipName }: { shipName: string }) {
	console.log(`ShipFallback component logic start`)

	console.log(`ShipFallback component rendering`)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img src="/img/fallback-ship.png" alt={shipName} />
			</div>
			<section>
				<h2>
					{shipName}
					<sup>
						XX <small>lyh</small>
					</sup>
				</h2>
			</section>
			<section>
				<ul>
					{Array.from({ length: 3 }).map((_, i) => (
						<li key={i}>
							<label>loading</label>:{' '}
							<span>
								XX <small>(loading)</small>
							</span>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

function ShipError({ shipName }: { shipName: string }) {
	console.log(`ShipError component logic start`)

	console.log(`ShipError component rendering`)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img src="/img/broken-ship.webp" alt="broken ship" />
			</div>
			<section>
				<h2>There was an error</h2>
			</section>
			<section>There was an error loading "{shipName}"</section>
		</div>
	)
}

// 🐨 create a ShipImg component which accepts all the props of a regular img
// element (🦺 React.ComponentProps<'img'>) and it should forward all props to
// the Img component and be wrapped by an ErrorBoundary with the fallback being
// simply <img {...props} />
function ShipImg(props: React.ComponentProps<'img'>) {
	console.log(`ShipImg component logic start`)

	console.log(`img props = ${JSON.stringify(props, null, 2)}`)

	console.log(`ShipImg component rendering`)

	return (
		<ErrorBoundary fallback={<img {...props}/>}>
			<Img {...props}/>
		</ErrorBoundary>
	)
}

function Img({ src = '', ...props }: React.ComponentProps<'img'>) {
	console.log(`Img component logic start`)
	
	src = use(imgSrc(src))
	
	console.log(`Img component rendering`)

	return <img src={src} {...props} />
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
