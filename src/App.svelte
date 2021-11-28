<script>
	import Home from './components/Home.svelte';
	import Actress from './components/Actress.svelte';
	import Photos from './components/Photos.svelte';
	import Photo from './components/Photo.svelte';
	import Videos from './components/Videos.svelte';
	import Video from './components/Video.svelte';

	import { Router, Route, Link, navigate } from "svelte-navigator";
	import PageStore from './stores/PageStore.js';
	import DataStore from './stores/DataStore.js';
	import { onMount, onDestroy } from 'svelte';
	import { getBaseurl, getRelativepath } from './services/ToolService.js';
	import { List } from "svelte-bootstrap-icons";

	let baseurl = getBaseurl();
	let page = "";
	//developement on localhost
	window.onload = () =>{
		if(window.location.host.includes("localhost")){
			let path = getRelativepath(window.location.host,window.location.href);
			navigate('/' + path, { replace: true });
		}
	}
	const unsubscribe = PageStore.subscribe(value => {
		page = value;
	});
	onDestroy(unsubscribe);

	const getData = () =>{
		fetch(baseurl + "/mk/actresses")
		.then(response=>response.json())
		.then(json=>{
			DataStore.update(data=>{
				data['actresses'] = json["allactresses"];
				return data;
			});
		});

		fetch(baseurl + "/mk/generalphotos")
		.then(response=>response.json())
		.then(json=>{
			DataStore.update(data=>{
				data['photos'] = json["photos"];
				return data;
			});
		});

		fetch(baseurl + "/mk/videos")
		.then(response=>response.json())
		.then(json=>{
			DataStore.update(data=>{
				data['videos'] = json["allvideos"];
				return data;
			});
		});
	}

	
	onMount(() => { // = onMount + beforeDestroy
		//......
		getData();
	});
</script>

<Router primary={false}>
	<header>
	<nav class="navbar navbar-expand-md fixed-top">
		<div class="container">
			<div class="navbar-brand">美女</div>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<List />
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item" class:active="{page==='home'}">
						<Link to="/" class="nav-link">Accueil</Link>
					</li>
					<li class="nav-item" class:active="{page==='photos'}">
						<Link to="photos" class="nav-link">Photos</Link>
					</li>
					<li class="nav-item" class:active="{page==='videos'}">
						<Link to="videos" class="nav-link">Vidéos</Link>
					</li>
				</ul>
				<form class="d-flex">
					<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
					<button class="btn btn-outline-success" type="submit">Search</button>
				</form>
			</div>
		</div>
	</nav>
	</header>
	<main class="undernav">
		<Route path="/">
			<Home />
		</Route>
		<Route path="actrice/:id" let:params>
			<Actress id={params.id} />
		</Route>
		<Route path="photos">
			<Photos />
		</Route>
		<Route path="videos">
			<Videos />
		</Route>
		<Route path="video/:id" let:params>
			<Video id={params.id} />
		</Route>
	</main>
</Router>

<style>
	nav{
		box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
		padding-top:0;
		padding-bottom:0;
		height:56px;
		background-color: white;
	}
	nav div.navbar-brand{
		padding-top:0;
		padding-bottom:0;
		padding-left:10px;
		padding-right:10px;
		display:flex;
		align-items: center;
		height:56px;
		background-color:#FF88af;
		color:white;
	}
	nav li.nav-item :global(.nav-link){
		color:#444;
	}
	nav li.nav-item.active :global(.nav-link){
		color:#FF88af;
		font-weight: bold;
	}
	nav .navbar-toggler{
		border:3px solid #FF88af;
		color: #FF88af;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	nav .navbar-toggler:focus{
		box-shadow: none;
	}
	@media(min-width:768px){
		nav .navbar-toggler{
			display:none
		}
    }
	@media(max-width:575px){
		nav .navbar-collapse form{
			padding-bottom:5px;
		}
    }
</style>