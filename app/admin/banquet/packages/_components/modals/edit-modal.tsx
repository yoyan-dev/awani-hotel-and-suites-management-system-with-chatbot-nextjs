import React from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Divider,
  Chip,
} from "@heroui/react";
import { BanquetPackage } from "@/types/banquet-package";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Search,
  Utensils,
} from "lucide-react";
import { useBanquetPackages } from "@/hooks/use-banquet-packages";
import { menuCategory } from "@/app/constants/banquet-menus";
interface UpdateModalProps {
  banquetPackage: BanquetPackage;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  banquetPackage,
  isOpen,
  onClose,
}) => {
  const { isLoading, error, updateBanquetPackage } = useBanquetPackages();
  const [formData, setFormData] =
    React.useState<BanquetPackage>(banquetPackage);

  const [selectedMenus, setSelectedMenus] = React.useState<any[]>(
    banquetPackage.categories || []
  );

  function toggleMenuSelection(menu: any) {
    const exist = selectedMenus.some((m) => m === menu);

    if (exist) {
      setSelectedMenus((prev) => prev.filter((m) => m !== menu));
    } else {
      setSelectedMenus((prev) => [...prev, menu]);
    }
  }

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>,
    payload: BanquetPackage
  ) {
    e.preventDefault();

    await updateBanquetPackage(payload);
    if (!error) onClose();
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={(open) => !open && onClose}
        onClose={onClose}
        radius="none"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 w-full bg-primary text-white">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Update Banquet Package
                </div>
              </ModalHeader>

              <ModalBody className="pb-6">
                <Form
                  className="w-full space-y-6"
                  onSubmit={(e) =>
                    onSubmit(e, { ...formData, categories: selectedMenus })
                  }
                >
                  <div className="flex gap-4 w-full">
                    <Input
                      fullWidth
                      required
                      label="Package Name"
                      placeholder="Enter package name"
                      name="name"
                      variant="bordered"
                      isRequired
                      radius="sm"
                      labelPlacement="outside"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />

                    <Input
                      fullWidth
                      required
                      label="Price"
                      placeholder="00.00"
                      name="price"
                      startContent="₱"
                      variant="bordered"
                      radius="sm"
                      labelPlacement="outside"
                      value={formData.price_per_cover?.toString()}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <Divider />

                  <div className="flex gap-4 flex-wrap">
                    {menuCategory.map((menu: any) => {
                      const isSelected = selectedMenus.some(
                        (m) => m === menu.uid
                      );

                      return (
                        <div
                          key={menu.uid}
                          onClick={() => toggleMenuSelection(menu.uid)}
                          className={`flex items-center justify-between px-4 py-2 rounded-lg  cursor-pointer transition-all 
                             hover:bg-default-100 hover:shadow-sm 
                             ${
                               isSelected
                                 ? "bg-gray-200 shadow-sm"
                                 : "bg-gray-100"
                             }`}
                        >
                          <div className="flex items-center gap-3">
                            <Utensils size={16} className="text-primary" />
                            <span className="font-medium">{menu.name}</span>
                          </div>

                          {isSelected && (
                            <CheckCircle
                              size={20}
                              className="text-primary transition-opacity"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedMenus.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium">Selected Menus:</p>

                      <div className="flex flex-wrap gap-2">
                        {selectedMenus.map((menu) => (
                          <Chip
                            key={menu}
                            onClose={() =>
                              setSelectedMenus((prev) =>
                                prev.filter((s) => s !== menu)
                              )
                            }
                            color="primary"
                            variant="flat"
                            radius="sm"
                            startContent={<Utensils size={14} />}
                          >
                            {menu}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-4 pt- w-full">
                    <Button onPress={onClose} variant="bordered" radius="sm">
                      Cancel
                    </Button>

                    <Button
                      color="primary"
                      type="submit"
                      isLoading={isLoading}
                      radius="sm"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateModal;
