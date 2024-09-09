import React from 'react';
import { Toast, ToastDescription, ToastTitle, useToast } from './ui/toast';
import { Alert, AlertIcon, AlertText } from './ui/alert';
import { CloseIcon } from './ui/icon';
import { ButtonIcon } from './ui/button';

interface ToastProps {
  id: string;
  title: string;
  description: string;
  status?: 'info' | 'warning' | 'success' | 'error';
  variant?: "solid" | "outline";
  isClosable?: boolean;
}

export const showToastAlert = ({ id, title, status, description }: ToastProps) => {
    return (
      <ToastAlert
        id={id}
        title={title}
        description={description}
        status={status}
      />
    )
};

const ToastAlert: React.FC<ToastProps> = ({
  id,
  title,
  description,
  status = 'info',
  variant = 'solid',
  isClosable = true,
}) => {

  const toast = useToast()
  const [toastId, setToastId] = React.useState('0')
  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast()
    }
  }
  const showNewToast = () => {
    const newId = Math.random().toString()
    setToastId(newId)
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="solid">
            <ToastTitle>Hello!</ToastTitle>
            <ToastDescription>
              This is a customized toast message.
            </ToastDescription>
          </Toast>
        )
      },
    })
  }

  const handleClose = () => {
    toast.close(id);
  };

  const bgColors = {
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  const textColors = {
    solid: 'text-white',
    outline: `text-${bgColors[status].split('-')[1]}-700`,
  };

  return (
    <Alert
      className={`w-full rounded-lg shadow-lg ${variant === 'solid' ? bgColors[status] : 'bg-white border border-' + bgColors[status].split('-')[1] + '-500'}`}
      action='muted'
      variant={variant}
    >
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start">
          <AlertIcon className={`mr-4 ${variant === 'solid' ? 'text-white' : bgColors[status].replace('bg-', 'text-')}`} />
          <div>
            <AlertText className={`font-semibold mb-1 ${textColors[variant]}`}>
              {title}
            </AlertText>
            <AlertText className={`${textColors[variant]} opacity-90`}>
              {description}
            </AlertText>
          </div>
        </div>
        {isClosable && (
          <ButtonIcon
            className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
            onPress={handleClose}
            as={CloseIcon}
          />
        )}
      </div>
    </Alert>
  );
};

export default ToastAlert;