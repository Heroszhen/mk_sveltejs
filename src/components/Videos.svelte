<script>
	import PageStore from '../stores/PageStore.js';
    import DataStore from '../stores/DataStore.js';
    import { onDestroy } from 'svelte';

    PageStore.set("videos");
    let allvideos = [];
    const unsubscribe = DataStore.subscribe(value => {
		allvideos = value["videos"];console.log(allvideos)
	});
	onDestroy(unsubscribe);
</script>

<div>
    
</div>

<style>
	
</style>