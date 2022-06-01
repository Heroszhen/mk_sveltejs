<script>
    import PageStore from "../stores/PageStore.js";
    import DataStore from "../stores/DataStore.js";
    import { ChevronLeft, ChevronRight } from "svelte-bootstrap-icons";
    import { onDestroy } from "svelte";

    PageStore.set("actress");
    export let id;
    let actress = null;
    let photoindex = 0;
    let photos_wrap;
    let mask = false;
    let ref_mask;
    let ref_image; //big photo
    let ref_wrapbigimage;
    let ref_bigimage;
    let bigimageurl = "";

    const unsubscribe = DataStore.subscribe((value) => {
        for (let entry of value["actresses"]) {
            if (entry["id"] == id) {
                actress = entry;
                break;
            }
        }
    });
    onDestroy(unsubscribe);

    function changeIndex(action, index = null) {
        if (action == null) {
            photoindex = index;
        } else {
            if (action == 1) photoindex++;
            if (action == 2) photoindex--;
            if (photoindex >= actress["mkphotos"].length) photoindex = 0;
            if (photoindex < 0) photoindex = actress["mkphotos"].length - 1;
            //window.scrollTo(photos_wrap.scrollLeft,0);
        }
    }

    //1:left; 2:right
    function scrollCarousel(way) {
        let step = 73;
        if (way == 1) {
            step = photos_wrap.scrollLeft - step;
            if (step < 0) step = 0;
        }
        if (way == 2) {
            let max = photos_wrap.scrollWidth - photos_wrap.clientWidth;
            step = photos_wrap.scrollLeft + step;
            if (step > max) step = max;
        }
        photos_wrap.scrollTo(step, photos_wrap.scrollTop);
    }

    //big image
    function switchMask(action) {
        if (action == 1) {
            //hover
            mask = true;
        } else {
            //leave
            mask = false;
        }
    }

    function moveMouse(e) {
        let clientRect = ref_image.getBoundingClientRect();
        let top = Math.ceil(clientRect.top); //y->vertical
        let left = Math.ceil(clientRect.left); //x -> horizontal
        let width_image = ref_image.clientWidth;
        let height_image = ref_image.clientHeight;
        if (
            e.clientY < top ||
            e.clientY > top + height_image ||
            e.clientX < left ||
            e.clientX > left + width_image
        ) {
            mask = false;
            return;
        }
        bigimageurl = ref_image.getAttribute("src");
        mask = true;
        let top2 = e.clientY - top - 50;
        if (top2 < 0) top2 = 0;
        if (e.clientY + 50 > top + height_image) top2 = height_image - 100;
        let left2 = e.clientX - left - 50;
        if (left2 < 0) left2 = 0;
        if (e.clientX + 50 > left + width_image) left2 = width_image - 100;
        ref_mask.style.top = top2 + "px";
        ref_mask.style.left = left2 + "px";
        let per_width = (e.clientX - left) / width_image;
        let per_height = (e.clientY - top) / height_image;

        //big image
        let half_wrap_width = ref_wrapbigimage.clientWidth / 2;
        let half_wrap_height = ref_wrapbigimage.clientHeight / 2;
        let bigwidth = per_width * ref_bigimage.clientWidth;
        let bigheight = per_height * ref_bigimage.clientHeight;
        ref_bigimage.style.marginLeft = half_wrap_width - bigwidth + "px";
        ref_bigimage.style.marginTop = half_wrap_height - bigheight + "px";
    }
</script>

<div id="actress">
    {#if actress != null}
        <div class="container container2">
            <div class="row">
                <div class="col-md-8 order-2 order-md-1">
                    <div class="container-fluid bg-white pt-2 pb-2">
                        {#if actress["mkphotos"].length != 0}
                            <div class="row">
                                <div class="col-12">
                                    <h3 class="text-center">{actress.name}</h3>
                                </div>
                                {#if actress["mkphotos"].length > 1}
                                    <div class="col-12 mb-3">
                                        <div class="zcarousel">
                                            <div
                                                class="btn_arrow"
                                                on:click={() =>
                                                    scrollCarousel(1)}
                                            >
                                                <ChevronLeft />
                                            </div>
                                            <div
                                                class="photos_wrap"
                                                bind:this={photos_wrap}
                                            >
                                                <div class="palette">
                                                    {#each actress["mkphotos"] as one, index (index)}
                                                        <div
                                                            class="onephoto"
                                                            class:active={photoindex ==
                                                                index}
                                                            on:click={() =>
                                                                changeIndex(
                                                                    null,
                                                                    index
                                                                )}
                                                        >
                                                            <img
                                                                src={one.photourl}
                                                                alt=""
                                                            />
                                                        </div>
                                                    {/each}
                                                </div>
                                            </div>
                                            <div
                                                class="btn_arrow"
                                                on:click={() =>
                                                    scrollCarousel(2)}
                                            >
                                                <ChevronRight />
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                                <div class="col-12 mt-2 mb-2">
                                    <div
                                        style="position:relative;cursor:move"
                                        on:mouseenter={() => switchMask(1)}
                                        on:mouseleave={() => switchMask(2)}
                                        on:mousemove={moveMouse}
                                    >
                                        <img
                                            src={actress["mkphotos"][photoindex]
                                                .photourl}
                                            alt=""
                                            class="pointer"
                                            bind:this={ref_image}
                                            on:click={() => changeIndex(1)}
                                        />
                                        <div
                                            id="mask"
                                            class:active={mask == true}
                                            bind:this={ref_mask}
                                        />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <span
                                        class="pointer arrow"
                                        on:click={() => changeIndex(2)}
                                    >
                                        <ChevronLeft />
                                        Précédent
                                    </span>
                                </div>
                                <div class="col-6 text-end">
                                    <span
                                        class="pointer arrow"
                                        on:click={() => changeIndex(1)}
                                    >
                                        Suivant
                                        <ChevronRight />
                                    </span>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                <div class="col-md-4 order-1 order-md-2 mb-2">
                    <div class="container-fluid bg-white pt-2 pb-2">
                        <img src={actress.photourl} alt="" />
                        <div class="pt-2">
                            <div>
                                <span class="fw-bold">Née</span>: {new Intl.DateTimeFormat(
                                    "fr-FR"
                                ).format(new Date(actress.birthday))}
                            </div>
                            <div class="pb-3">
                                <span class="fw-bold">Pays</span>: {actress.country}
                            </div>
                            {@html actress.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<div
    id="wrap_bigimage"
    class:active={mask == true}
    bind:this={ref_wrapbigimage}
>
    <img src={bigimageurl} alt="" bind:this={ref_bigimage} />
</div>

<style>
    .arrow {
        padding: 5px;
    }
    .arrow:hover {
        background-color: #f8b0c8;
        color: white;
        border-radius: 2px;
    }

    .zcarousel {
        width: 100%;
        display: flex;
    }
    .zcarousel .btn_arrow {
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8b0c8;
        color: white;
        cursor: pointer;
        height: 100px;
    }
    .zcarousel .photos_wrap {
        width: calc(100% - 60px);
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .zcarousel .photos_wrap .palette {
        /* width:9999px; */
        display: flex;
        align-items: center;
    }
    .zcarousel .photos_wrap .onephoto {
        width: 70px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border: 3px solid transparent;
        cursor: pointer;
    }
    .zcarousel .photos_wrap .onephoto.active {
        border-color: #ff88af;
    }
    .zcarousel .photos_wrap .onephoto img {
        width: 100%;
        height: auto;
    }
    #mask {
        position: absolute;
        z-index: 100;
        width: 100px;
        height: 100px;
        background: yellow;
        opacity: 0.5;
        cursor: move;
        display: none;
        top: 0;
        left: 0;
    }
    #mask.active {
        display: block;
    }
    #wrap_bigimage {
        position: absolute;
        z-index: 100;
        position: fixed;
        top: 80px;
        right: 10px;
        width: 38%;
        height: 80%;
        overflow: hidden;
        background-color: white;
        display: none;
    }
    #wrap_bigimage.active {
        display: block;
    }
    #wrap_bigimage img {
        width: 100vw;
        position: absolute;
        z-index: 101;
    }
</style>
