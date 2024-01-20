<script>
	import { onMount } from "svelte";

  let getCustomerModal

  onMount(()=>{
    getCustomerModal = document.getElementById('get-customer-modal')
  })
</script>

<dialog id="get-customer-modal" class="modal">
  <div class="modal-box bg-white">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press ESC key or click the button below to close</p>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>