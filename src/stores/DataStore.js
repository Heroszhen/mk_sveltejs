import { writable } from "svelte/store";

const DataStore = writable({
        actresses:[],
        photos:[],
        videos:[]
    });

export default DataStore;