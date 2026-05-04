type ModalStatus = 'oculto' | 'cargando' | 'exito' | 'error';

export interface ModalState {
  status: ModalStatus;
  title: string;
  subtitle: string;
}
