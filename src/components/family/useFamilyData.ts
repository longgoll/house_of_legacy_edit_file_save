"use client";

import { useState, useEffect } from "react";

interface FamilyData {
  familyName: string;
  familyLevel: string;
  familyReputation: string;
  dataLoaded: boolean;
}

export function useFamilyData(): FamilyData {
  const [familyName, setFamilyName] = useState<string>("");
  const [familyLevel, setFamilyLevel] = useState<string>("");
  const [familyReputation, setFamilyReputation] = useState<string>("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return;

    // Load family data from sessionStorage
    const loadFamilyData = () => {
      try {
        const gameDataString = sessionStorage.getItem("gameData");

        if (gameDataString) {
          const gameData = JSON.parse(gameDataString);

          // Check if FamilyData exists in the game data
          if (
            gameData.FamilyData &&
            gameData.FamilyData.value &&
            Array.isArray(gameData.FamilyData.value)
          ) {
            const familyData = gameData.FamilyData.value;

            // Extract family information
            // FamilyData.value[1] = Family Name (Họ gia tộc)
            // FamilyData.value[2] = Family Level (Cấp bậc gia tộc)
            // FamilyData.value[3] = Family Reputation (Điểm danh tiếng)
            const name = familyData[1]?.toString() || "Chưa có gia tộc";
            const level = familyData[2]?.toString() || "0";
            const reputation = familyData[3]?.toString() || "0";

            setFamilyName(name);
            setFamilyLevel(level);
            setFamilyReputation(reputation);
            setDataLoaded(true);

            console.log("Family data loaded from sessionStorage:", {
              name,
              level,
              reputation,
            });
          } else {
            // No family data found in game data
            setFamilyName("Chưa có gia tộc");
            setFamilyLevel("0");
            setFamilyReputation("0");
            setDataLoaded(true);

            console.log("No FamilyData found in game data");
          }
        } else {
          // No game data in sessionStorage
          setFamilyName("Chưa tải dữ liệu game");
          setFamilyLevel("0");
          setFamilyReputation("0");
          setDataLoaded(true);

          console.log("No game data found in sessionStorage");
        }
      } catch (error) {
        console.error("Error loading family data:", error);
        // Set error values
        setFamilyName("Lỗi tải dữ liệu");
        setFamilyLevel("0");
        setFamilyReputation("0");
        setDataLoaded(true);
      }
    };

    // Load data immediately
    loadFamilyData();

    // Listen for storage changes (in case data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gameData") {
        loadFamilyData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    familyName,
    familyLevel,
    familyReputation,
    dataLoaded,
  };
}
