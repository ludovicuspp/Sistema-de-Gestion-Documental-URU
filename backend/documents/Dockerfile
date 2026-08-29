# Contexto de build: carpeta backend (padre de documents y commons).
# Ejemplo: docker build -f documents/Dockerfile .

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["commons/Sidae.Commons.csproj", "commons/"]
COPY ["documents/Sidae.Documents/Sidae.Documents.csproj", "documents/Sidae.Documents/"]
RUN dotnet restore "documents/Sidae.Documents/Sidae.Documents.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "documents/Sidae.Documents/Sidae.Documents.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "documents/Sidae.Documents/Sidae.Documents.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Sidae.Documents.dll"]
