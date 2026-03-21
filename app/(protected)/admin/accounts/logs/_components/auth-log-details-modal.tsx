import {
  Button,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { AuthLog } from "@/types/auth-log";

interface AuthLogDetailsModalProps {
  log: AuthLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthLogDetailsModal({
  log,
  isOpen,
  onClose,
}: AuthLogDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Log Details</ModalHeader>
            <ModalBody>
              {log ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-default-500">Event</span>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={log.event_type === "login" ? "success" : "warning"}
                    >
                      {log.event_type}
                    </Chip>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-500">Time</span>
                    <span>{new Date(log.event_at).toLocaleString("en-US")}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between">
                    <span className="text-default-500">Email</span>
                    <span>{log.email ?? "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-500">Role</span>
                    <span className="capitalize">{log.role ?? "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-500">User ID</span>
                    <span className="font-mono break-all">{log.user_id ?? "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-500">Device</span>
                    <span>{log.device_name ?? "Not set"}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between gap-4">
                    <span className="text-default-500">IP Address</span>
                    <span className="text-right">{log.ip_address ?? "Not set"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-default-500">User Agent</span>
                    <span className="break-all text-xs">{log.user_agent ?? "Not set"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-default-500">No log selected.</div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                color="primary"
                onPress={() => {
                  closeModal();
                  onClose();
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
