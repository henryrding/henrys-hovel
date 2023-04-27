import { Toast } from 'bootstrap';

export default function handleToast() {
  const toastTrigger = document.getElementById('liveToastBtn')
  const toastLiveExample = document.getElementById('liveToast')
  if (toastTrigger) {
    const toast = new Toast(toastLiveExample);
    toast.show();
  }
}
