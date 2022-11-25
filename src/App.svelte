<script>
	import Home from "./components/Home.svelte";
	import Actress from "./components/Actress.svelte";
	import Photos from "./components/Photos.svelte";
	import Photo from "./components/Photo.svelte";
	import Videos from "./components/Videos.svelte";
	import Video from "./components/Video.svelte";
	import Search from "./components/Search.svelte";

	import { Router, Route, Link, navigate } from "svelte-navigator";
	import PageStore from "./stores/PageStore.js";
	import DataStore from "./stores/DataStore.js";
	import SearchStore from "./stores/SearchStore.js";
	import { onMount, onDestroy } from "svelte";
	import {
		getBaseurl,
		getRelativepath,
		stopPropagation,
	} from "./services/ToolService.js";
	import { List } from "svelte-bootstrap-icons";

	let baseurl = getBaseurl();
	let page = "";
	let btn_nav;
	let keywords = "";
	let deferredPrompt = null;
	//developement on localhost
	window.onload = () => {
		if (window.location.host.includes("localhost")) {
			let path = getRelativepath(
				window.location.host,
				window.location.href
			);
			navigate("/" + path, { replace: true });
		}
	};
	const unsubscribe = PageStore.subscribe((value) => {
		page = value;
	});
	onDestroy(unsubscribe);
	window.addEventListener("beforeinstallprompt", (e) => {
		deferredPrompt = e;
	});

	const getData = () => {
		fetch(baseurl + "/mk/actresses")
			.then((response) => response.json())
			.then((json) => {
				DataStore.update((data) => {
					data["actresses"] = json["allactresses"];
					return data;
				});
			});

		fetch(baseurl + "/mk/generalphotos")
			.then((response) => response.json())
			.then((json) => {
				DataStore.update((data) => {
					data["photos"] = json["photos"];
					return data;
				});
			});
		/*
		fetch(baseurl + "/mk/videos")
		.then(response=>response.json())
		.then(json=>{
			DataStore.update(data=>{
				data['videos'] = json["allvideos"].reverse();
				return data;
			});
		});*/
	};

	function clickBtnnav() {
		if (window.innerWidth <= 767) btn_nav.click();
	}

	onMount(() => {
		// = onMount + beforeDestroy
		//......
		getData();
	});

	function search(e) {
		clickBtnnav();
		stopPropagation(e);
		SearchStore.set(keywords);

		navigate("/recherche/s?query=" + keywords, { replace: true });
	}
	async function installApp() {
		if (deferredPrompt !== null && deferredPrompt != undefined) {
			console.log(deferredPrompt);
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === "accepted") {
				deferredPrompt = null;
			}
		}
	}
</script>

<Router primary={false}>
	<header>
		<nav class="navbar navbar-expand-md fixed-top">
			<div class="container">
				<div class="navbar-brand">美女</div>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
					bind:this={btn_nav}
				>
					<List />
				</button>
				<div
					class="collapse navbar-collapse"
					id="navbarSupportedContent"
				>
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li
							class="nav-item"
							class:active={page === "home"}
							on:click={() => clickBtnnav()}
						>
							<Link to="/" class="nav-link">Accueil</Link>
						</li>
						<li
							class="nav-item"
							class:active={page === "photos"}
							on:click={() => clickBtnnav()}
						>
							<Link to="photos" class="nav-link">Photos</Link>
						</li>
						<li
							class="nav-item"
							class:active={page === "videos"}
							on:click={() => clickBtnnav()}
						>
							<Link to="videos" class="nav-link">Vidéos</Link>
						</li>
						{#if deferredPrompt !== null && deferredPrompt != undefined}
							<li
								class="nav-item d-flex"
								on:click={() => installApp()}
							>
								<button class="meinuzi-full-btn" type="button"
									>Installer</button
								>
							</li>
						{/if}
					</ul>
					<form class="d-flex" on:submit={search}>
						<input
							class="form-control me-2"
							type="search"
							placeholder="Search"
							aria-label="Search"
							bind:value={keywords}
						/>
						<button class="meinuzi-btn" type="submit"
							>Chercher</button
						>
					</form>
				</div>
			</div>
		</nav>
	</header>
	<main class="undernav">
		<Route path="/">
			<Home />
		</Route>
		<Route path="/actrices">
			<Home />
		</Route>
		<Route path="actrice/:id" let:params>
			<Actress id={params.id} />
		</Route>
		<Route path="photos">
			<Photos />
		</Route>
		<Route path="photo/:id" let:params>
			<Photo id={params.id} />
		</Route>
		<Route path="videos">
			<Videos />
		</Route>
		<Route path="video/:id" let:params>
			<Video id={params.id} />
		</Route>
		<Route path="recherche/:query">
			<Search />
		</Route>
	</main>
</Router>

<style>
	nav {
		box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
		padding-top: 0;
		padding-bottom: 0;
		background-color: white;
	}
	nav div.navbar-brand {
		padding-top: 0;
		padding-bottom: 0;
		padding-left: 10px;
		padding-right: 10px;
		display: flex;
		align-items: center;
		height: 56px;
		background-color: #ff88af;
		color: white;
	}
	nav li.nav-item :global(.nav-link) {
		color: #444;
	}
	nav li.nav-item.active :global(.nav-link) {
		color: #ff88af;
		font-weight: bold;
	}
	nav .navbar-toggler {
		border: 3px solid #ff88af;
		color: #ff88af;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	nav .navbar-toggler:focus {
		box-shadow: none;
	}
	@media (min-width: 768px) {
		nav .navbar-toggler {
			display: none;
		}
	}
	@media (max-width: 575px) {
		nav .navbar-collapse form {
			padding-bottom: 5px;
		}
	}
</style>
