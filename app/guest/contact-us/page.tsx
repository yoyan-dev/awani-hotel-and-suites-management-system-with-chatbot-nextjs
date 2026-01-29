"use client";

import React from "react";
import { Input, Textarea, Button, Card } from "@heroui/react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
// import "leaflet/dist/leaflet.css";

export default function ContactUsPage() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-medium text-xs uppercase tracking-wide">
            LET'S CONNECT
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
            Get in Touch Now
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Have questions or want to book a service? Reach out using the form
            or contact info below.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info + Map */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact Info */}
            <Card className="space-y-4 p-6 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={20} />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  119 Industrial Dr #1031, Massachusetts USA
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  orders@pilgrimcolonial.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary" size={20} />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  +1 413 233 4597
                </span>
              </div>
            </Card>

            {/* Map */}
            {/* <div className="w-full h-64 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <MapContainer
                center={[42.3601, -71.0589]} // Massachusetts coords
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[42.3601, -71.0589]}>
                  <Popup>Pilgrim Colonial</Popup>
                </Marker>
              </MapContainer>
            </div> */}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                className="rounded-md border border-gray-200 dark:border-gray-700"
              />
              <Input
                placeholder="Email"
                className="rounded-md border border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Phone"
                className="rounded-md border border-gray-200 dark:border-gray-700"
              />
              <Input
                placeholder="Subject"
                className="rounded-md border border-gray-200 dark:border-gray-700"
              />
            </div>
            <Textarea
              placeholder="Message"
              className="rounded-md border border-gray-200 dark:border-gray-700"
              rows={5}
            />

            <Button color="primary" className="px-6 py-2 mt-2 rounded-md">
              Send
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
