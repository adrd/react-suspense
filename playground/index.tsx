import { Suspense, use, useState, useTransition } from 'react'
import * as ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { getImageUrlForShip, getShip } from './utils.tsx'

function App() {
	console.log(`App component logic start`)

	const [shipName, setShipName] = useState('Dreadnought')
	// 🐨 call useTransition here to get the isPending boolean and startTransition function
	const [isPending, startTransition] = useTransition()

	function handleShipSelection(newShipName: string) {
		console.log(`handleShipSelection called`)

		// 🐨 wrap setShipName in startTransition
		startTransition(() => {
			console.log('cb startTransition called')

			setShipName(newShipName)
		})
	}

	console.log(`App component rendering`)

	return (
		<div className="app-wrapper">
			<ShipButtons shipName={shipName} onShipSelect={handleShipSelection} />
			<div className="app">
				{/* 🐨 add inline styles to set the opacity to 0.6 if we're pending */}
				<div className="details" style={ {opacity: isPending ? 0.6 : 1} }>
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
	console.log(`ShipDetails logic start`)
	
	const ship = use(getShip(shipName, 2000))

	console.log(`ShipDetails component rendering`)

	return (
		<div className="ship-info">
			<div className="ship-info__img-wrapper">
				<img
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

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
