
export interface ModalOptions {
  title?: string;
  message?: string;
  centered?: boolean;

  fade?: boolean;

  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  focus?: boolean;
}

export interface ConfirmOptions extends ModalOptions {
  confirmText?: string;
  cancelText?: string;
  confirmClass?: string;
  cancelClass?: string;
}

export interface AlertOptions extends ModalOptions {
  okText?: string;
  okClass?: string;
}

interface CustomModal extends bootstrap.Modal {
  wrapper: HTMLElement;
}

function mergeDefaults<T extends Object>(defaults: T, options?: T): T {
  return Object.assign({}, defaults, options);
}

function createModal(options: ModalOptions, footerElements?: HTMLElement[]): CustomModal {
  
  const wrapper = document.createElement('div');
  wrapper.className = 'modal ';
  if(options.fade) wrapper.className += ' fade'; 
  wrapper.tabIndex = -1;
  document.body.appendChild(wrapper);

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog ';
  if(options.centered) dialog.className += 'modal-dialog-centered';
  wrapper.appendChild(dialog);

  const content = document.createElement('div');
  content.className = 'modal-content';
  dialog.appendChild(content);

  const header = document.createElement('div');
  header.className = 'modal-header';
  content.appendChild(header);

  const title = document.createElement('h5');
  title.className = 'modal-title';
  title.innerText = options.title;
  header.appendChild(title);

  if(options?.message ?? true) {
    const body = document.createElement('div');
    body.className = 'modal-body';
    content.appendChild(body);

    const message = document.createElement('p');
    message.innerText = options.message;
    body.appendChild(message);
  }

  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  content.appendChild(footer);

  footerElements?.forEach((el) => {
    footer.appendChild(el);
  });

  return Object.assign(
    new window.bootstrap.Modal(wrapper, {
      backdrop: options.closeOnBackdropClick,
      keyboard: options.closeOnEsc,
      focus: options.focus,
    }), 
    {
      wrapper
    }
  );

}

function confirm(arg1?: ConfirmOptions | string): Promise<boolean> {

  let options: ConfirmOptions = typeof arg1 === 'string' ? {
    title: arg1,
    message: '',
  }: arg1;

  const defaults: ConfirmOptions = {
    title: 'Confirm',
    message: 'Are you sure you want to do this?',
    centered: true,
    fade: true,

    cancelText: 'Cancel',
    cancelClass: 'btn-secondary',
    confirmText: 'Confirm',
    confirmClass: 'btn-primary',

    closeOnBackdropClick: true,
    closeOnEsc: true,
    focus: true,
  }

  options = mergeDefaults(defaults, options);


  return new Promise((resolve) => {

    const cancel = document.createElement('button');
    cancel.className = 'btn ' + options.cancelClass;
    cancel.innerText = options.cancelText;

    const confirm = document.createElement('button');
    confirm.className = 'btn ' + options.confirmClass;
    confirm.innerText = options.confirmText;

    const modal = createModal(options, [cancel, confirm]);

    modal.wrapper.addEventListener('hidden.bs.modal', modal.wrapper.remove);

    cancel.addEventListener('click', () => {
      modal.hide();
      resolve(false);
    });
    
    confirm.addEventListener('click', () => {
      modal.hide();
      resolve(true);
    });

    modal.show();

  });

}

function alert(arg1?: AlertOptions | string): Promise<void> {
  
  let options: AlertOptions = typeof arg1 === 'string' ? {
    title: arg1,
  } : arg1;
  
  const defaults: AlertOptions = {
    title: 'Alert',
    message: '',
    centered: true,
    fade: true,

    okText: 'OK',
    okClass: 'btn-primary',

    closeOnBackdropClick: true,
    closeOnEsc: true,
    focus: true,
  }

  options = mergeDefaults(defaults, options);

  return new Promise((resolve) => {

    const ok = document.createElement('button');
    ok.className = 'btn ' + options.okClass;
    ok.innerText = options.okText;

    const modal = createModal(options, [ok]);

    modal.wrapper.addEventListener('hidden.bs.modal', modal.wrapper.remove);

    ok.addEventListener('click', () => {
      modal.hide();
      resolve();
    });

    modal.show();

  });
}


export { confirm, alert, createModal };
